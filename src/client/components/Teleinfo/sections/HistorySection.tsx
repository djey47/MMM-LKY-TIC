import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import formatDate from 'date-fns/format';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';
import { useContext, useMemo } from 'react';
import { VALUE_NA } from '../../../shared/displayConstants';
import { displayPriceWithTwoDecimals } from '../../../shared/displayHelper';
import ConfigurationContext from '../../../contexts/ConfigurationContext';
import type { TeleInfo } from '../../../../shared/domain/teleinfo';
import type { InfoSectionCommonProps } from '../../../types/client';
import './HistorySection.scss';

type HistoryItem = (number | undefined)[] | undefined;

type HistoryTopic = 'costs-lastDays' | 'costs-lastMonths';

interface HistoryData {
  topic: HistoryTopic; histo: HistoryItem;
}

interface TableProps {
  tableData: HistoryData[];
  topic: HistoryTopic;
}

const HISTORY_DAYS_SIZE = 7;
const HISTORY_MONTHS_SIZE = 6;

const displayHistoItem = (topic: HistoryTopic, item: HistoryItem, index: number, config?: ModuleConfiguration) => {
  if (!item) {
    return VALUE_NA;
  }

  const unitPerTopic: Record<HistoryTopic, string> = {
    'costs-lastDays': config?.currencySymbol ?? '',
    'costs-lastMonths': config?.currencySymbol ?? '',
  };

  const unit = unitPerTopic[topic];
  const estimatedCost = item[index];
  return `${displayPriceWithTwoDecimals(estimatedCost)}${unit}`;
}

const Table = ({ tableData, topic }: TableProps) => {
  const data = useMemo(() => tableData, []);
  const configuration = useContext(ConfigurationContext);

  const now = new Date();
  const columns = useMemo<ColumnDef<HistoryData, string>[]>(
    () => {

      const histoSize = topic === 'costs-lastDays' ? HISTORY_DAYS_SIZE : HISTORY_MONTHS_SIZE;

      const columnDefs = Array.from({ length: histoSize })
        .map((_, index) => {
          const header = topic === 'costs-lastDays' ?
            formatDate(subDays(now, index), 'd.MM') : formatDate(subMonths(now, index), 'MM.yy');
          return ({
            header,
            accessorFn: ({ topic, histo }) => displayHistoItem(topic, histo, index, configuration),
            id: `${topic}-${index}`,
          }) as ColumnDef<HistoryData, string>;
        });
      return [
        {
          header: '',
          accessorFn: ({ topic }) => {
            if (topic === 'costs-lastDays') {
              return 'Days';
            }
            if (topic === 'costs-lastMonths') {
              return 'Months';
            }
            return '';
          },
          id: 'topic',
        },
        ...columnDefs,
      ];
    }, []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table style={{ border: 'solid 2px', width: '100%', color: 'rgb(153,153,153)' }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{ padding: '0', fontSize: '0.8rem' }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              const textColor = cell.column.id === 'topic' ? 'rgb(153, 153, 153)' : 'white';
              return (
                <td
                  key={cell.id}
                  style={{ padding: '0.1rem', border: 'solid 1px rgb(153, 153, 153)', fontSize: '0.8rem', color: textColor }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const HistorySection = ({ data }: InfoSectionCommonProps) => {
  if (!data) {
    return null;
  }

  const toTopicTableData = (rawData: TeleInfo, topic: HistoryTopic) => {
    let histo: HistoryItem;
    switch (topic) {
      case 'costs-lastDays':
        histo = rawData.estimatedPrices?.history?.lastDays;
        break;
      case 'costs-lastMonths':
        histo = rawData.estimatedPrices?.history?.lastMonths;
        break;
      default:
        histo = undefined;
    }
    return {
      histo
    };
  };

  const toTableData = (rawData: TeleInfo, topic: HistoryTopic): HistoryData[] => {
    return [{
      topic,
      ...toTopicTableData(rawData, topic),
    }];
  };

  return (
    <section className="history-section">
      <p className="history-section__title">Costs History</p>
      <Table tableData={toTableData(data, 'costs-lastDays')} topic='costs-lastDays' />
      <Table tableData={toTableData(data, 'costs-lastMonths')} topic='costs-lastMonths' />
    </section>
  );
};

export default HistorySection;

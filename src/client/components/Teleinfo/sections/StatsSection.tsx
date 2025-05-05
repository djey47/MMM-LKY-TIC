import formatDate from 'date-fns/format';
import { useContext, useMemo } from 'react';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { VALUE_NA } from '../../../shared/displayConstants';
import { displayDate, displayPriceWithTwoDecimals, getPeriodLabel } from '../../../shared/displayHelper';
import ConfigurationContext from '../../../contexts/ConfigurationContext';
import type { CollectedSupply, Estimated, StatisticsValues, TeleInfo, TopicStatistics } from '../../../../shared/domain/teleinfo';
import type { InfoSectionCommonProps } from '../../../types/client';
import './StatsSection.scss';

type Item = StatisticsValues | number[] | number | undefined;

type Topic = 'power' | 'intensity' | 'supplied' | 'costs';

interface Data {
  topic: Topic; day: Item; month: Item; year: Item; overall: Item; fareOption?: string;
}

interface TableProps {
  tableData: Data[];
}

const displaySingleValue = (value?: number) => {
  return value ?? VALUE_NA;
};

const displayItem = (topic: Topic, item: Item, config?: ModuleConfiguration) => {
  if (!item) {
    return VALUE_NA;
  }

  const unitPerTopic: Record<string, string> = {
    power: 'W',
    intensity: 'A',
    supplied: 'Wh',
    costs: config?.currencySymbol ?? '',
  };

  const unit = unitPerTopic[topic];
  if (topic === 'power' || topic === 'intensity') {
    const { min, max } = item as StatisticsValues;
    return `${displaySingleValue(min)}/${displaySingleValue(max)}${unit}`;
  } else if (topic === 'supplied') {
    const suppliedValues = item as number[];
    const totalSupplied = suppliedValues.reduce((acc, val) => acc + (val || 0), 0);

    const allValues = suppliedValues.map((v) => displaySingleValue(v)).join('+');
    return `${totalSupplied}${unit}(${allValues})`;
  } else if (topic === 'costs') {
    const estimatedCost = item as number;
    return `${displayPriceWithTwoDecimals(estimatedCost)}${unit}`;
  }
}

const Table = ({ tableData }: TableProps) => {
  const data = useMemo(() => tableData, []);
  const configuration = useContext(ConfigurationContext);

  const now = new Date();

  const columns = useMemo<ColumnDef<Data, string>[]>(
    () => [
      {
        header: '',
        accessorFn: ({ topic, day, fareOption }) => {
          if (topic === 'supplied') {
            const optionLabels = (day as number[]).map((_o, r) => getPeriodLabel(fareOption, r)).join('+');
            return `${topic} (${optionLabels})`;
          } else if (topic === 'power') {
            return 'pwr (est.)';
          } else if (topic === 'costs') {
            return 'costs (est.)';
          }
          return topic;
        },
        id: 'topic',
      },
      {
        header: formatDate(now, 'EEEE d'),
        accessorFn: ({ day, topic }) => displayItem(topic, day, configuration),
        id: 'day',
      },
      {
        header: formatDate(now, 'MMMM'),
        accessorFn: ({ month, topic }) => displayItem(topic, month, configuration),
        id: 'month',
      },
      {
        header: formatDate(now, 'yyyy'),
        accessorFn: ({ year, topic }) => displayItem(topic, year, configuration),
        id: 'year',
      },
    ], []
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

const StatsSection = ({ data }: InfoSectionCommonProps) => {
  if (!data) {
    return null;
  }

  const toTopicTableData = (rawData: TeleInfo, topic: string) => {
    let stats: TopicStatistics | CollectedSupply | Estimated | undefined;
    let fareOption: string | undefined;
    switch (topic) {
      case 'power':
        stats = rawData.statistics.instantEstimatedPower;
        break;
      case 'intensity':
        stats = rawData.statistics.instantIntensity;
        break;
      case 'supplied':
        stats = rawData.suppliedPower;
        fareOption = rawData.chosenFareOption;
        break;
      case 'costs':
        stats = rawData.estimatedPrices;
        break;
      default:
        stats = undefined;
    }

    const day = stats?.currentDay;
    const month = stats?.currentMonth;
    const year = stats?.currentYear;
    const overall = stats?.overall;
    return {
      day,
      month,
      year,
      overall,
      fareOption,
    };
  };

  const toTableData = (rawData: TeleInfo): Data[] => {
    const topics: Topic[] = [
      'power',
      'intensity',
      'supplied',
      'costs',
    ];

    return topics.map((topic) => ({
      topic,
      ...toTopicTableData(rawData, topic),
    }));
  };

  const { meta } = data;
  const firstReceivedDataDate = displayDate(
    meta?.firstDataTimestamp
  );
  const lastReceivedDataDate = displayDate(
    meta?.lastUpdateTimestamp
  );

  return (
    <section className="stats-section">
      <p className="stats-section__title">Statistics</p>
      <Table tableData={toTableData(data)} />
      <div className="stats-section__dates">
        <p className="stats-section__dates-start-last">
          <span className="stats-section__dates-start-last-label">First-last data:</span>
          <span className="stats-section__dates-start-last-value">
            {firstReceivedDataDate}&nbsp;-&nbsp;{lastReceivedDataDate}
          </span>
        </p>
      </div>
    </section>
  );
};

export default StatsSection;

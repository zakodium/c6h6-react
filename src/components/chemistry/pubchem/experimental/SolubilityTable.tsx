import { ExternalLinkIcon } from '@heroicons/react/outline';

import CompactTd from '@/components/common/CompactTd';
import { Table, Th } from '@/components/tailwind-ui';

export default function SolubilityTable(props: { data: any }) {
  const { data } = props;
  if (!data) return <>No solubility data found.</>;
  return (
    <div>
      <div className="pt-5 text-xl">Solubility</div>
      <Table Header={Header} data={data} Tr={Row} />
    </div>
  );
}

function Header() {
  return (
    <tr>
      <Th className="w-3/4">Original value</Th>
      <Th>Reference</Th>
    </tr>
  );
}

function Row(props: any) {
  const value = props.value;
  return (
    <tr key={value.label}>
      <CompactTd>{value.data.original}</CompactTd>
      <CompactTd>
        <div>
          {value.reference.sourceName}
          <a href={value.reference.url} rel="noreferrer" target="_blank">
            <ExternalLinkIcon className="inline w-5 h-5" />
          </a>
        </div>
      </CompactTd>
    </tr>
  );
}

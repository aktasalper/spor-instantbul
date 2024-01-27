import type { ComponentPropsWithoutRef } from "react";

const Table = (props: ComponentPropsWithoutRef<"table">) => (
	<table {...props} className='border-collapse rounded-l text-left border-2 border-solid border-primary-600' />
);

const Th = (props: ComponentPropsWithoutRef<"th">) => (
	<th {...props} className='min-w-[100px] p-2 border-2 border-solid border-primary-600' />
);

const Td = (props: ComponentPropsWithoutRef<"td">) => (
	<td {...props} className='bg-primary-800 p-2 border-2 border-solid border-primary-600' />
);

Table.Th = Th;
Table.Td = Td;

export { Table };

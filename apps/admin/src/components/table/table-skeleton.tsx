import { Skeleton } from "@renovabit/ui/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@renovabit/ui/components/ui/table";

const DEFAULT_ROWS = 8;
const DEFAULT_COLUMNS = 6;

interface TableSkeletonProps {
	/** Número de columnas (celdas por fila) */
	columnCount?: number;
	/** Número de filas de carga */
	rowCount?: number;
}

/**
 * Skeleton que imita una tabla para estados de carga.
 * Mantiene un espacio estable y evita saltos de layout.
 */
export function TableSkeleton({
	columnCount = DEFAULT_COLUMNS,
	rowCount = DEFAULT_ROWS,
}: TableSkeletonProps) {
	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{Array.from({ length: columnCount }).map((_, i) => (
							<TableHead key={i}>
								<Skeleton className="h-4 w-full max-w-[120px]" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: rowCount }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{Array.from({ length: columnCount }).map((_, colIndex) => (
								<TableCell key={colIndex}>
									<Skeleton
										className="h-5 w-full"
										style={{
											maxWidth: colIndex === 0 ? 200 : 120,
										}}
									/>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

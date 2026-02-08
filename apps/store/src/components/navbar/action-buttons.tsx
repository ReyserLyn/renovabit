import { ComputerIcon, PercentSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@renovabit/ui/components/ui/button";

import Link from "next/link";

export function ActionButtons() {
	return (
		<div className="flex items-center gap-4">
			<Button
				nativeButton={false}
				className="hidden md:inline-flex"
				variant="secondary"
				render={
					<Link href="/arma-tu-pc">
						<HugeiconsIcon icon={ComputerIcon} size={16} />
						Arma tu PC
					</Link>
				}
			/>

			<Button
				nativeButton={false}
				variant="secondary"
				render={
					<Link href="/ofertas">
						<HugeiconsIcon icon={PercentSquareIcon} size={16} />
						Ofertas!
					</Link>
				}
			/>
		</div>
	);
}

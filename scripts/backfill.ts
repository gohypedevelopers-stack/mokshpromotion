
import { db } from "@/lib/db";

async function main() {
    console.log("Starting backfill...");
    const items = await db.inventoryHoarding.findMany({});

    console.log(`Found ${items.length} items to backfill.`);

    for (const item of items) {
        const code = `INV-${item.id}`;
        await db.inventoryHoarding.update({
            where: { id: item.id },
            data: { inventoryCode: code }
        });
        console.log(`Updated item ${item.id} with code ${code}`);
    }

    console.log("Backfill complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });

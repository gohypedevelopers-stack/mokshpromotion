
import { db } from "./lib/db"

async function checkStates() {
    try {
        const count = await db.inventoryHoarding.count();
        console.log("Total inventory items:", count);

        const states = await db.inventoryHoarding.findMany({
            distinct: ['state'],
            select: { state: true },
            orderBy: { state: 'asc' }
        });
        console.log("Distinct states found:", states);
    } catch (error) {
        console.error("Error checking states:", error);
    }
}

checkStates();

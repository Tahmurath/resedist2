import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function DemoPage() {

    const data = [
        {
            id: "728ed52f",
            amount: 10,
            status: "pending",
            email: "aaa@example.com",
        },
        {
            id: "728ed52f",
            amount: 20,
            status: "pending",
            email: "bbbm@example.com",
        },{
            id: "728ed52f",
            amount: 30,
            status: "pending",
            email: "cccm@example.com",
        },
        {
            id: "728ed52f",
            amount: 40,
            status: "pending",
            email: "dddm@example.com",
        },{
            id: "728ed52f",
            amount: 50,
            status: "pending",
            email: "eeem@example.com",
        },
        {
            id: "728ed52f",
            amount: 60,
            status: "pending",
            email: "ffm@example.com",
        },{
            id: "728ed52f",
            amount: 70,
            status: "pending",
            email: "ggm@example.com",
        },
        {
            id: "728ed52f",
            amount: 80,
            status: "pending",
            email: "hhm@example.com",
        },{
            id: "728ed52f",
            amount: 90,
            status: "pending",
            email: "iim@example.com",
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "wwwm@example.com",
        },{
            id: "728ed52f",
            amount: 110,
            status: "pending",
            email: "sdsdm@example.com",
        },
        {
            id: "728ed52f",
            amount: 200,
            status: "pending",
            email: "safasdm@example.com",
        },{
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "jghjhm@example.com",
        },
        {
            id: "728ed52f",
            amount: 200,
            status: "pending",
            email: "ghjgm@example.com",
        },{
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "728ed52f",
            amount: 200,
            status: "pending",
            email: "m@example.com",
        },
    ]
    //const data =  getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}

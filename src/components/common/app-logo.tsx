import { Slack } from "lucide-react"
export default function AppLogo() {
    return (
        <div className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-teal-500 flex p-2 items-center justify-center rounded-md text-white">
                        <Slack className="size-5" />
                    </div>
                    
                    <span className="sidebar-label text-2xl font-bold">RESTOKU</span>
                </div>
    )
}
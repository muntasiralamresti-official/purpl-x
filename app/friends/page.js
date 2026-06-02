import { User } from "lucide-react";
import Sidebar from "../component/Sidebar";

async function getUsers() {
    return await get("/users?limit=80",{
        revalidate: 60 * 5,
    });
}

export default async function FriendsPage(){

    const data = await getUsers();

    return (
        <main className="min-h-screen bg-white">

            <div className="container mx-auto px-4 pt-6 flex gap-8">

                {/* Sidebar */}
                <Sidebar/>

                {/* Friends */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-3xl bg-brand shadow-2xl flex items-center justify-center text-white">
                                <User size={36}/>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-primary">Friends</h1>
                                <p className="text-primary/60 mt-1">Connect with people around you</p>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {data?.users?.map((user) => (
                            <div key={user.id} className="bg-white rounded-2xl overflow-hidden border border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300">
                               {/* Image */}
                               <div className="h-40 overflow-hidden">
                                <image src={user.image} alt={user.firstName} width={fit} height={fit} className="transition-all duration-500 hover:scale-105"/>
                               </div>

                               {/* Content */}

                               <div className="px-5 pb-5 text-center">
                                <h2 className="text-xl font-bold text-primary truncate">{user.firstName}{user.lastName}</h2>
                                <p className="text-sm text-primary/60 mt-1">{user.id} % 40 + 6 mutual friends</p>


                                {/* Buttons */}

                                <div className="mt-5 space-y-2">
                                    <button className="w-full py-3 rounded-2xl bg-brand hover:bg-brand/80 text-white font-medium transition-all">Add Friend</button>
                                    <button className="w-full py-3 rounded-2xl bg-white hover:bg-white/80 text-primary font-medium transition-all">Remove</button>
                                </div>
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
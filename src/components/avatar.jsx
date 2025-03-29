export default function Avatar({ user }) {

    return (
        user?.user_metadata?.avatar_url ? (
            <div className="h-8 w-8 rounded-mg">
                <img className="w-full h-full rounded-md select-none" referrerPolicy="no-referrer" src={user.user_metadata.avatar_url} alt="user avatar" />
            </div>
        ) : (
            <div className="flex justify-center items-center text-white h-8 w-8 bg-linear-to-br from-indigo-500 to-pink-500 rounded-md">
                {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </div>
        )
    )
}
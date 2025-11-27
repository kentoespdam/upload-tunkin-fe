import AppTemplate from "@/components/template";
import { getUser } from "@/lib/session";
import type { JwtUserToken } from "@/tipes/auth";

const template = async({children}:{children:React.ReactNode}) => {
    const user = await getUser();
    
    return <AppTemplate user={user as JwtUserToken}>{children}</AppTemplate>;
}

export default template;
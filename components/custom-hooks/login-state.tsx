import { useRouter } from "next/router";
import { Role } from "../../lib/model/role";
import storage from '../../lib/services/storage';

export const useUserRole = (): Role=>{
    const router = useRouter();
  
    return storage.role || (router.pathname.split('/')[2] as Role); // 2: path name start with a slash; e.g.: '/d/a' --split--> ['','d',a'];
}
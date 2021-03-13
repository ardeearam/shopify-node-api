import { Session } from '../session';
import { SessionStorage } from '../session_storage';
export declare class MemorySessionStorage implements SessionStorage {
    private sessions;
    storeSession(session: Session): Promise<boolean>;
    loadSession(id: string): Promise<Session | undefined>;
    deleteSession(id: string): Promise<boolean>;
}
//# sourceMappingURL=memory.d.ts.map
import { Session } from '../session';
import { SessionStorage } from '../session_storage';
export declare class CustomSessionStorage implements SessionStorage {
    readonly storeCallback: (session: Session) => Promise<boolean>;
    readonly loadCallback: (id: string) => Promise<Session | Record<string, unknown> | undefined>;
    readonly deleteCallback: (id: string) => Promise<boolean>;
    constructor(storeCallback: (session: Session) => Promise<boolean>, loadCallback: (id: string) => Promise<Session | Record<string, unknown> | undefined>, deleteCallback: (id: string) => Promise<boolean>);
    storeSession(session: Session): Promise<boolean>;
    loadSession(id: string): Promise<Session | undefined>;
    deleteSession(id: string): Promise<boolean>;
}
//# sourceMappingURL=custom.d.ts.map
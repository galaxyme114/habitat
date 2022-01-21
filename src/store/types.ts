export interface Credentials extends Object {
    email: string;
    password: string;
}

export interface User extends Object {
    [index: string]: any;

    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: number;
    status: number;
    habitats: {
        current: string;
        owners: [string];
        users: [string];
    };
}

export interface Habitat extends Object {
    [index: string]: any;

    id: string;
    name: string;
    owner: [string];
    users: [string];
    admins: [string];
}

export interface HabitatName extends Object {
    id: string;
    name: string;
}

export interface Habitats extends Object {
    current: Habitat;
    habitats: HabitatName[];
    inviteToken: string;
    createHabitat: boolean;
}

export interface DataField extends Object {
    id: string;
    value: any;
}

export interface Token extends Object {
    token: string;
    expires: string;
}

export interface Tokens extends Object {
    access: Token;
    refresh: Token;
}

export interface LoginResponse extends Object {
    user: User;
    tokens: Tokens;
}

export interface Auth extends Object {
    authenticated: boolean;
    tokens: Tokens | null;
    user: User | null;
}

export interface Constant extends Object {
    [index: string]: any;
}

export interface Constants extends Object {
    [index: string]: any;

    loaded: boolean;
    statuses: Constant;
    roles: Constant;
    themes: Constant;
}

export interface ConstantsResponse extends Object {
    statuses: Constant;
    roles: Constant;
    themes: Constant;
}

export interface RootState extends Object {
    auth: Auth;
    constants: Constants;
    habitats: Habitats;
    roomPlans: RoomPlanStore;
}

// Room Planner
export interface RoomPlan extends Object {
    [index: string]: any;

    id: string;
    projectId: string;
    name: string;
    description: string;
}

// Basic canvas object, Konva stage, layers, groups, and shapes all extend Node.
export interface Node extends Object {
    [index: string]: any;

    id: string;
    name: string;

    x: number;
    y: number;
    width: number;
    height: number;

    opacity: number;
    rotation: number;

    scale: object;
    scaleX: number;
    scaleY: number;

    offset: object;
    offsetX: number;
    offsetY: number;

    draggable: boolean;
    visible: boolean;
    listening: boolean;

    // dragDistance: number
    // dragBoundFunc: function

    // NOTE Can use getAttrs to get the current state
}

// Corner and wall segment
export interface WallSegment extends Object {
    [index: string]: any;

    x: number;
    y: number;

    // For a closed loop all will be true and the first will connect with the last, otherwise the first will have no connection
    // connect: boolean;
}

export interface Segments extends Array<WallSegment> {
    [index: number]: WallSegment;
}

export interface Wall extends Object {
    [index: string]: any;

    id: string;
    thickness: number;
    height: number;
    segments: Segments;
}

export interface Walls extends Array<Wall> {
 [index: number]: Wall;
}

export interface Point extends Object {
    x: number;
    y: number;
}

export interface Element extends Object {
    [index: string]: any;

    index: number;
    type: string;
    config: object;
    dataset: object;
    segments: Point[];
    src: string|null;
    objectName: string|null;
    configTransformer: object|null;
}

export interface ElementSegmentIndex extends Object {
    elementIndex: number|null;
    segmentIndex: number|null;
}

export interface RoomPlanStore extends Object {
    [index: string]: any;

    roomPlan: RoomPlan|null;
    dimensionUnits: string;

    // TODO Is this being used any more?
    // deltas: [object];
    // modal: {
    //     visible: boolean;
    //     x: number;
    //     y: number;
    //     title: string;
    //     component: string;
    // };
    history: [[Element]];
    historyStep: number;
    drawingMode: null|string;
    selectedElementIndex: number|null;
    selectedSegmentIndex: number|null;

    // TODO Add in layers
    elements: [Element];
    cursor: string|null;
    catalogue: {
        doors: [];
        windows: [];
        cupboards: [];
        appliances: [];
    };
}

export interface Attached extends Object {
    element: Element;
    indexSegment: number;
    delta: number;
}

export interface Notification extends Object {
    [index: string]: any;

    id: string;
    recipient: string;
    sender: string;
    text: string;
}

export interface Notifications extends Object {
    notifications: Notification[];
}

export interface NewNotificationCount extends Object {
    counter: number;
}

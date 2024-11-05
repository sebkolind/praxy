import type { C } from './c';
import type { Attributes } from './attributes';
import type { TentElement } from './component';

type CreateTagFn = (context: TagContext) => Tag;

type TagContext = [string, TagChildren, Attributes | undefined];

type Tags = Record<string, Tag>;

type Tag = (children: TagChildren, attributes?: Attributes) => TentElement;

type TagChildren = TagChild | TagChild[];

type TagChild = Node | string | number | C<any, any> | null;

export type { Tags, CreateTagFn, TagContext, TagChildren, TagChild };

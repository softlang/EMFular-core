import { ReLinkListContainer } from "../referencable/container/link/re-link-list-container";
import { ReLinkSingleContainer } from "../referencable/container/link/re-link-single-container";
import { ReTreeListContainer } from "../referencable/container/tree/re-tree-list-container";
import { ReTreeParentContainer } from "../referencable/container/tree/re-tree-parent-container";
import { ReTreeSingleContainer } from "../referencable/container/tree/re-tree-single-container";
import { Referencable } from "../referencable/referenceable";

export enum InformationLinkType {
  SUPPLEMENT = 'SUPPLEMENT',
  SUPPORT = 'SUPPORT',
  STRONG_SUPPORT = 'STRONG_SUPPORT',
  ATTACK = 'ATTACK',
  STRONG_ATTACK = 'STRONG_ATTACK',
}

export class Conversation extends Referencable<any> {
  static readonly $authorName = 'author';
  static readonly $conversationPartnersName = 'conversationPartners';

  title: string;

  _author: ReTreeSingleContainer<Author>;
  get author(): Author {
    return this._author.get()!!
  }
  set author(author: Author) {
    this._author.add(author);
  }
  _conversationPartners: ReTreeListContainer<ConversationPartner>;
  get conversationPartners(): ConversationPartner[] {
    return this._conversationPartners.get()
  }
  addCP(...cps: ConversationPartner[]) {
    cps.map(cp => {
      this._conversationPartners.add(cp)
    })
  }

  constructor(
    title: string = 'New Conversation'
  ) {
    super();
    this._author = new ReTreeSingleContainer<Author>(this, Conversation.$authorName);
    this._conversationPartners = new ReTreeListContainer<ConversationPartner>(this, Conversation.$conversationPartnersName);
    this.title = title;
    this.author = new Author();
  }

  static create(title: string = 'New conversation', author?: Author): Conversation {
    const conv = new Conversation('New Conversation');
    conv.title = title;
    conv.author = author? author: new Author();
    return conv;
  }

}

export abstract class LifeLine extends Referencable<Conversation>{
  name: string;
  xPosition: number; //int todo

  protected constructor(name?: string, xPosition: number = 0) {
    super();
    this.name = name? name: '';
    this.xPosition = xPosition;
  }

}

export class ConversationPartner extends LifeLine {

  constructor(name: string = 'NewPartner', xPosition?: number) {
    super(name, xPosition);
  }

  static create(name: string = 'NewPartner', xPosition?: number): ConversationPartner {
    const cp = new ConversationPartner()
    cp.name = name
    cp.xPosition = xPosition? xPosition : 0;
    return cp;
  }

}

export class Author extends LifeLine{
  static readonly $preknowledgeName: string = 'preknowledge';
  static readonly $messagesName: string = 'messages';

  _preknowledge: ReTreeListContainer<Preknowledge>;
  get preknowledge(): Preknowledge[] {
    return this._preknowledge.get()
  }
  addPreknowledge(...preknowledge: Preknowledge[]) {
    preknowledge.map(p => {
      this._preknowledge.add(p)
    })
  }

  _messages: ReTreeListContainer<Message>;
  get messages(): Message[] {
    return this._messages.get()
  }
  addMessage(...msgs: Message[]) {
    msgs.map(m => {
      this._messages.add(m)
    })
  }

  constructor() {
    super();
    this._preknowledge = new ReTreeListContainer<Preknowledge>(this, Author.$preknowledgeName)
    this._messages = new ReTreeListContainer<Message>(this, Author.$messagesName)
  }

  static create(name?: string, xPosition: number = 0): Author {
    const auth = new Author()
    auth.name = name? name: ''
    auth.xPosition = xPosition
    return auth
  }

}

export abstract class Message extends Referencable<Author> {
  public static readonly $counterPartName = 'counterPart'

  _counterPart: ReLinkSingleContainer<ConversationPartner, this>;
  get counterPart(): ConversationPartner {
    return this._counterPart.get()!! //todo
  }
  set counterPart(value: ConversationPartner) {
    this._counterPart.add(value);
  }

  timing: number;
  content: string;
  originalContent?: string;

  protected constructor(
    timing: number = 0,
    content: string = "",
    originalContent?: string,
  ) {
    super();
    this.timing = timing;
    this.content = content;
    this.originalContent = originalContent;
    this._counterPart = new ReLinkSingleContainer(this, Message.$counterPartName)
  }

  static isSend(eClass: string) {
    return eClass.endsWith("SendMessage");
  }

  isSend(): this is SendMessage {
    return this instanceof SendMessage
  }

  isReceive(): this is ReceiveMessage {
    return this instanceof ReceiveMessage
  }

  static newMessage(isSend: boolean, counterPart: ConversationPartner, timing: number, content: string, originalContent: string = 'Original content'): Message {
    if (isSend) {
      return SendMessage.create(counterPart, timing, content, originalContent)
    } else {
      return ReceiveMessage.create(counterPart, timing, content, originalContent)
    }
  }
}


export class SendMessage extends Message {
  public static readonly $usesName = 'uses'

  private readonly _uses: ReLinkListContainer<Information, this>;
  get uses(): Information[] {
    return this._uses.get();
  }
  addUsage(info: Information) {
    this._uses.add(info)
  }
  removeUsage(info: Information): boolean {
    return this._uses.remove(info)
  }

  constructor(
    timing?: number,
    content: string = 'New send content',
    originalContent?: string,
  ) {
    super(timing, content, originalContent);
    this._uses  = new ReLinkListContainer(this, SendMessage.$usesName, Information.$isUsedOnName);
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content: string = 'New send content',
                originalContent?: string,
  ): SendMessage {
    const send = new SendMessage(timing, content, originalContent);
    send.counterPart = counterPart;
    return send;
  }

}

export class ReceiveMessage extends Message {
  static readonly $generatesName: string = 'generates';
  static readonly $repeatsName: string = 'repeats';

  _generates: ReTreeListContainer<NewInformation>;
  get generates(): NewInformation[] {
    return this._generates.get()!!
  }

  _repeats: ReLinkListContainer<Information, this>;
  get repeats(): Information[] {
    return this._repeats.get();
  }
  addRepetition(info: Information) {
    this._repeats.add(info);
  }
  removeRepetition(info: Information): boolean {
    return this._repeats.remove(info);
  }

  isInterrupted: boolean = false;

  constructor(
    timing?: number,
    content: string = "New receive content",
    originalContent?: string,
    isInterrupted: boolean = false,
  ) {
    super(timing, content, originalContent);
    this._generates = new ReTreeListContainer(this, ReceiveMessage.$generatesName, NewInformation.$sourceName);
    this._repeats = new ReLinkListContainer(this, ReceiveMessage.$repeatsName, Information.$repeatedByName);
    this.isInterrupted = isInterrupted;
  }

  static create(counterPart: ConversationPartner,
                timing: number,
                content?: string,
                originalContent?: string,
                isInterrupted: boolean = false,): ReceiveMessage {
    const rec = new ReceiveMessage(timing, content, originalContent, isInterrupted);
    rec.counterPart = counterPart;
    return rec
  }

}

export abstract class Information<
  P extends Referencable<any>=Referencable<any>
> extends Referencable<P> {

  message: string = "";
  isInstruction: boolean = false;
  initialTrust: number | undefined;
  currentTrust: number | undefined;
  feltTrustImmediately: number | undefined;
  feltTrustAfterwards: number | undefined;

  abstract getTiming(): number;

  static readonly $causesName: string = 'causes'
  static readonly $isUsedOnName: string = 'isUsedOn'
  static readonly $repeatedByName: string = 'repeatedBy'
  static readonly $targetedByName: string = 'targetedBy'
  readonly _causes: ReTreeListContainer<InformationLink>;
  get causes(): InformationLink[] {
    return this._causes.get();
  }

  readonly _targetedBy: ReLinkListContainer<InformationLink, this>
  get targetedBy(): InformationLink[] {
    return this._targetedBy.get();
  }

  readonly _isUsedOn: ReLinkListContainer<SendMessage, this>
  get isUsedOn(): SendMessage[] {
    return this._isUsedOn.get();
  }
  addIsUsedOn(...send: SendMessage[]){
    send.map(s => this._isUsedOn.add(s))
  }
  removeIsUsedOn(send: SendMessage){
    this._isUsedOn.remove(send)
  }

  readonly _repeatedBy: ReLinkListContainer<ReceiveMessage, this>
  get repeatedBy(): ReceiveMessage[] {
    return this._repeatedBy.get();
  }

  addRepeatedBy(msg: ReceiveMessage) {
    this._repeatedBy.add(msg)
  }
  removeRepeatedBy(msg: ReceiveMessage) {
    this._repeatedBy.remove(msg)
  }

  protected constructor() {
    super();

    this._causes = new ReTreeListContainer<InformationLink>(this, NewInformation.$causesName, InformationLink.$sourceName);
    this._targetedBy = new ReLinkListContainer(this, Information.$targetedByName, InformationLink.$targetName)
    this._isUsedOn = new ReLinkListContainer(this, 'isUsedOn', 'uses');
    this._repeatedBy = new ReLinkListContainer(this, NewInformation.$repeatedByName, ReceiveMessage.$repeatsName);
  }

  abstract duplicate(): Information;

}
export class NewInformation extends Information<ReceiveMessage> {

  public static readonly $sourceName = 'source'

  readonly _source: ReTreeParentContainer<this>;
  set source(rec: ReceiveMessage) {
    this._source.add(rec)
  }
  get source(): ReceiveMessage {
    return this._source.get()!!
  }

  override getTiming(): number {
    return this.source.timing
  }

  constructor() {
    super();
    this._source = new ReTreeParentContainer(this, NewInformation.$sourceName, ReceiveMessage.$generatesName);
  }

  override duplicate(): NewInformation {
    return NewInformation.create(this.source, 'Copy of ' + this.message, this.isInstruction, this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  static create(source: ReceiveMessage,
                message: string, isInstruction: boolean = false,
                initialTrust?: number, currentTrust?: number, feltTrustImmediately?: number, feltTrustAfterwards?: number,): NewInformation {
    const info = new NewInformation();
    info.source = source;
    info.message = message;
    info.isInstruction = isInstruction;
    info.initialTrust = initialTrust;
    info.currentTrust = currentTrust;
    info.feltTrustImmediately = feltTrustImmediately;
    info.feltTrustAfterwards = feltTrustAfterwards;
    return info;
  }

}

export class Preknowledge extends Information<Author> {

  constructor() {
    super();
  }

  getTiming(): number {
    let timing;
    if (this.isUsedOn?.length >0) {
      timing = Math.min(...this.isUsedOn.map(send => send.timing));
    } else {
      timing = 0
    }
    return timing
  }

  override duplicate(): Preknowledge {
    return Preknowledge.create('Copy of ' + this.message, this.isInstruction, this.initialTrust, this.currentTrust, this.feltTrustImmediately, this.feltTrustAfterwards);
  }

  static create(message: string = 'Preknowledge', isInstruction: boolean = false,
                initialTrust?: number, currentTrust?: number,
                feltTrustImmediately?: number, feltTrustAfterwards?: number): Preknowledge {
    const pre = new Preknowledge()
    pre.message = message
    pre.isInstruction = isInstruction
    pre.initialTrust = initialTrust
    pre.currentTrust = currentTrust
    pre.feltTrustImmediately = feltTrustImmediately
    pre.feltTrustAfterwards = feltTrustAfterwards
    return pre
  }

}

export class InformationLink extends Referencable<Information> {

  public static readonly $sourceName = 'source'
  public static readonly $targetName = 'target'
  readonly _source: ReTreeParentContainer<this>
  get source(): Information {
    return this._source.get()!!; //todo
  }
  set source(source: Information) {
    this._source.add(source)
  }

  readonly _target: ReLinkSingleContainer<Information, this>
  get target(): Information {
    return this._target.get()!!;
  }
  set target(target: Information) {
    this._target.add(target);
  }

  type: InformationLinkType = InformationLinkType.SUPPLEMENT;
  linkText?: string;

  constructor() {
    super();
    this._source = new ReTreeParentContainer(this, InformationLink.$sourceName, NewInformation.$causesName);
    this._target = new ReLinkSingleContainer(this, InformationLink.$targetName, Information.$targetedByName);
  }

  static create(source: Information, target: Information, type: InformationLinkType, linkText?: string,): InformationLink {
    const link = new InformationLink()
    link.source = source
    link.target = target;
    link.type = type
    link.linkText = linkText
    return link
  }

}




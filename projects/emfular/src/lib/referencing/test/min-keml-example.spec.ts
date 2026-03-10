import { DeletionMode } from "../../utils/deletion-mode";
import { ConversationPartner, InformationLink, InformationLinkType, NewInformation, Preknowledge, ReceiveMessage, SendMessage } from "./min-keml-example";

describe('MinKemlExample', () => {
  it('relaxed deletion of NewInformation should delete reference to source', () => {
    let partner: ConversationPartner = new ConversationPartner();
    let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
    let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
    let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
    expect(newInfoA.source).toBeDefined();
    expect(newInfoB.source).toBeDefined();
    expect(recMess.generates.length).toBe(2);
    newInfoA.destruct(DeletionMode.RELAXED);
    expect(newInfoA.source).toBeUndefined();
    expect(newInfoB.source).toBeDefined();
    expect(recMess.generates.length).toBe(1);
  });

  it('cascaded deletion of NewInformation should delete reference to source', () => {
    let partner: ConversationPartner = new ConversationPartner();
    let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
    let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
    let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
    expect(newInfoA.source).toBeDefined();
    expect(newInfoB.source).toBeDefined();
    expect(recMess.generates.length).toBe(2);
    newInfoA.destruct(DeletionMode.CASCADE);
    expect(newInfoA.source).toBeUndefined();
    expect(newInfoB.source).toBeDefined();
    expect(recMess.generates.length).toBe(1);
  });

  it('relaxed deletion of NewInformation should delete reference to isUsedOn', () => {
    let partner: ConversationPartner = new ConversationPartner();
    let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
    let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
    let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
    let sendMessA: SendMessage = SendMessage.create(partner, 0, 'Sent message A');
    let sendMessB: SendMessage = SendMessage.create(partner, 0, 'Sent message B');
    sendMessA.addUsage(newInfoA);
    sendMessA.addUsage(newInfoB);
    sendMessB.addUsage(newInfoA);
    sendMessB.addUsage(newInfoB);
    expect(newInfoA.source).toBeDefined();
    expect(newInfoB.source).toBeDefined();
    expect(recMess.generates.length).toBe(2);
    expect(newInfoA.isUsedOn.length).toBe(2);
    expect(newInfoB.isUsedOn.length).toBe(2);
    expect(sendMessA.uses.length).toBe(2);
    expect(sendMessB.uses.length).toBe(2);
    newInfoA.destruct(DeletionMode.RELAXED);
    expect(newInfoA.source).toBeUndefined();
    expect(newInfoB.source).toBeDefined();
    expect(recMess.generates.length).toBe(1);
    expect(newInfoA.isUsedOn.length).toBe(0);
    expect(newInfoB.isUsedOn.length).toBe(2);
    expect(sendMessA.uses.length).toBe(1);
    expect(sendMessB.uses.length).toBe(1);
  });
});
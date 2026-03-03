import { DeletionMode } from "../../utils/deletion-mode";
import { ConversationPartner, InformationLink, InformationLinkType, NewInformation, Preknowledge, ReceiveMessage, SendMessage } from "./min-keml-example";

describe('MinKemlExample', () => {
  it('should work', () => {
    const recMessA = ReceiveMessage.create(new ConversationPartner(), 0, 'Received content A');
    const recMessB = ReceiveMessage.create(new ConversationPartner(), 1, 'Received content B');
    const newInfoA = NewInformation.create(recMessA, 'New info A'); 
    const newInfoB = new NewInformation();
    newInfoA.addRepeatedBy(recMessB);
    const sendMess = SendMessage.create(new ConversationPartner(), 2, 'Send content');
    newInfoA.addIsUsedOn(sendMess);
    const infoLinkAB = InformationLink.create(newInfoA, newInfoB, InformationLinkType.SUPPORT, 'Linking A to B');
    const preKnow = Preknowledge.create('Preknowledge');
    const infoLinkPreA = InformationLink.create(preKnow, newInfoA, InformationLinkType.ATTACK, 'Preknowledge attacking A');
    newInfoA.destruct(DeletionMode.RELAXED);
  });
});
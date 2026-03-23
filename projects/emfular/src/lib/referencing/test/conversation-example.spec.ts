import {
    Author,
    ConversationPartner,
    InformationLink,
    InformationLinkType,
    NewInformation,
    ReceiveMessage,
    SendMessage
} from "./conversation-example";

describe('Conversation Example', () => {
    it('deletion of NewInformation should delete reference to source', () => {
        let partner: ConversationPartner = new ConversationPartner();
        let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
        let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
        let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
        expect(newInfoA.source).toBeDefined();
        expect(newInfoB.source).toBeDefined();
        expect(recMess.generates.length).toBe(2);
        newInfoA.destruct();
        expect(newInfoA.source).toBeUndefined();
        expect(newInfoB.source).toBeDefined();
        expect(recMess.generates.length).toBe(1);
    });

    it('deletion of NewInformation should delete reference to isUsedOn', () => {
        let partner: ConversationPartner = new ConversationPartner();
        let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
        let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
        let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
        let sendMessA: SendMessage = SendMessage.create(partner, 0, 'Sent message A');
        let sendMessB: SendMessage = SendMessage.create(partner, 0, 'Sent message B');
        let author: Author = Author.create('Author');
        author.addMessage(sendMessA, sendMessB);
        sendMessA.addUsage(newInfoA);
        sendMessA.addUsage(newInfoB);
        sendMessB.addUsage(newInfoA);
        sendMessB.addUsage(newInfoB);
        expect(author.messages.length).toBe(2);
        expect(newInfoA.source).toBeDefined();
        expect(newInfoB.source).toBeDefined();
        expect(recMess.generates.length).toBe(2);
        expect(newInfoA.isUsedOn.length).toBe(2);
        expect(newInfoB.isUsedOn.length).toBe(2);
        expect(sendMessA.uses.length).toBe(2);
        expect(sendMessB.uses.length).toBe(2);
        newInfoA.destruct();
        expect(author.messages.length).toBe(2);
        expect(newInfoA.source).toBeUndefined();
        expect(newInfoB.source).toBeDefined();
        expect(recMess.generates.length).toBe(1);
        expect(newInfoA.isUsedOn.length).toBe(0);
        expect(newInfoB.isUsedOn.length).toBe(2);
        expect(sendMessA.uses.length).toBe(1);
        expect(sendMessB.uses.length).toBe(1);
    });

    it('deletion of NewInformation should delete reference to repeatedBy', () => {
        let partner: ConversationPartner = new ConversationPartner();
        let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
        let recMessRepA: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message RepA');
        let recMessRepB: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message RepB');
        let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
        let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
        recMessRepA.addRepetition(newInfoA);
        recMessRepA.addRepetition(newInfoB);
        recMessRepB.addRepetition(newInfoA);
        recMessRepB.addRepetition(newInfoB);
        expect(newInfoA.source).toBeDefined();
        expect(newInfoB.source).toBeDefined();
        expect(recMess.generates.length).toBe(2);
        expect(recMessRepA.repeats.length).toBe(2);
        expect(recMessRepB.repeats.length).toBe(2);
        expect(newInfoA.repeatedBy.length).toBe(2);
        expect(newInfoB.repeatedBy.length).toBe(2);
        newInfoA.destruct();
        expect(newInfoA.source).toBeUndefined();
        expect(newInfoB.source).toBeDefined();
        expect(recMess.generates.length).toBe(1);
        expect(recMessRepA.repeats.length).toBe(1);
        expect(recMessRepB.repeats.length).toBe(1);
        expect(newInfoA.repeatedBy.length).toBe(0);
        expect(newInfoB.repeatedBy.length).toBe(2);
    });

    it('deletion of NewInformation should delete reference to causes and delete children', () => {
        let partner: ConversationPartner = new ConversationPartner();
        let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
        let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
        let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
        let newInfoC: NewInformation = NewInformation.create(recMess, 'Info C');
        let infoLinkAB: InformationLink = InformationLink.create(newInfoA, newInfoB, InformationLinkType.ATTACK);
        let infoLinkAC: InformationLink = InformationLink.create(newInfoA, newInfoC, InformationLinkType.SUPPORT);
        expect(newInfoA.source).toBeDefined();
        expect(newInfoA.causes.length).toBe(2);
        expect(infoLinkAB.source).toBeDefined();
        expect(infoLinkAC.source).toBeDefined();
        expect(infoLinkAB.target).toBeDefined();
        expect(infoLinkAC.target).toBeDefined();
        newInfoA.destruct();
        expect(newInfoA.source).toBeUndefined();
        expect(newInfoA.causes.length).toBe(0);
        expect(infoLinkAB.source).toBeUndefined();
        expect(infoLinkAC.source).toBeUndefined();
        expect(infoLinkAB.target).toBeUndefined();
        expect(infoLinkAC.target).toBeUndefined();
    });

    it('deletion of NewInformation should delete reference to targetedBy and delete children', () => {
        let partner: ConversationPartner = new ConversationPartner();
        let recMess: ReceiveMessage = ReceiveMessage.create(partner, 0, 'Received message');
        let newInfoA: NewInformation = NewInformation.create(recMess, 'Info A');
        let newInfoB: NewInformation = NewInformation.create(recMess, 'Info B');
        let newInfoC: NewInformation = NewInformation.create(recMess, 'Info C');
        let infoLinkBA: InformationLink = InformationLink.create(newInfoB, newInfoA, InformationLinkType.ATTACK);
        let infoLinkCA: InformationLink = InformationLink.create(newInfoC, newInfoA, InformationLinkType.SUPPORT);
        expect(newInfoA.source).toBeDefined();
        expect(newInfoA.targetedBy.length).toBe(2);
        expect(infoLinkBA.source).toBeDefined();
        expect(infoLinkCA.source).toBeDefined();
        expect(infoLinkBA.target).toBeDefined();
        expect(infoLinkCA.target).toBeDefined();
        newInfoA.destruct();
        expect(newInfoA.source).toBeUndefined();
        expect(newInfoA.targetedBy.length).toBe(0);
        expect(infoLinkBA.source).toBeDefined();
        expect(infoLinkCA.source).toBeDefined();
        expect(infoLinkBA.target).toBeUndefined();
        expect(infoLinkCA.target).toBeUndefined();
    });
});
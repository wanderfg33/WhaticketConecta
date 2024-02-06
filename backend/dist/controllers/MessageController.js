"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.store = exports.store2 = exports.store3 = exports.store4 = exports.store5 = exports.store6 = exports.store7 = exports.index = void 0;
const SetTicketMessagesAsRead_1 = __importDefault(require("../helpers/SetTicketMessagesAsRead"));
const socket_1 = require("../libs/socket");
const ListMessagesService_1 = __importDefault(require("../services/MessageServices/ListMessagesService"));
const ShowTicketService_1 = __importDefault(require("../services/TicketServices/ShowTicketService"));
const DeleteWhatsAppMessage_1 = __importDefault(require("../services/WbotServices/DeleteWhatsAppMessage"));
const SendWhatsAppMedia_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMedia"));
const SendWhatsAppMessage_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMessage"));
const SendWhatsAppMessage_2 = __importDefault(require("../services/WbotServices/SendWhatsAppMessage2"));
const SendSMS = __importDefault(require("../services/WbotServices/SendSMS"));
const MakeVoiceCall = __importDefault(require("../services/WbotServices/MakeVoiceCall"));
const ChangeGroupTitle = __importDefault(require("../services/WbotServices/ChangeGroupTitle"));
const ChangeGroupDescription = __importDefault(require("../services/WbotServices/ChangeGroupDescription"));
const CreateGroup = __importDefault(require("../services/WbotServices/CreateGroup"));
exports.index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const { pageNumber } = req.query;
    const { count, messages, ticket, hasMore } = yield ListMessagesService_1.default({
        pageNumber,
        ticketId
    });
    SetTicketMessagesAsRead_1.default(ticket);
    return res.json({ count, messages, ticket, hasMore });
});
exports.store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const { body, quotedMsg } = req.body;
    const medias = req.files;
    const ticket = yield ShowTicketService_1.default(ticketId);
    SetTicketMessagesAsRead_1.default(ticket);
    if (medias) {
        yield Promise.all(medias.map((media) => __awaiter(void 0, void 0, void 0, function* () {
            yield SendWhatsAppMedia_1.default({ media, ticket });
        })));
    }
    else {
        yield SendWhatsAppMessage_1.default({ body, ticket, quotedMsg });
    }
    return res.send();
});
exports.store2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, message, ticketwhatsappId } = req.body;
    yield SendWhatsAppMessage_2.default({ number, message, ticketwhatsappId });
    return res.send();
});
exports.store3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, ticketwhatsappId } = req.body;
    yield ChangeGroupTitle.default({ subject, ticketwhatsappId });
    return res.send();
});
exports.store4 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, ticketwhatsappId } = req.body;
    yield ChangeGroupDescription.default({ description, ticketwhatsappId });
    return res.send();
});
exports.store5 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, contact, ticketwhatsappId } = req.body;
    yield CreateGroup.default({ title, contact, ticketwhatsappId });
    return res.send();
});
exports.store6 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, text } = req.body;
    yield SendSMS.default({ from, to, text });
    return res.send();
});
exports.store7 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, text } = req.body;
    yield MakeVoiceCall.default({ from, to, text });
    return res.send();
});
exports.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const message = yield DeleteWhatsAppMessage_1.default(messageId);
    const io = socket_1.getIO();
    io.to(message.ticketId.toString()).emit("appMessage", {
        action: "update",
        message
    });
    return res.send();
});

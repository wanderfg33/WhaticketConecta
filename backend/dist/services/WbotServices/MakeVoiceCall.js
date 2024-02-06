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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Vonage = require('@vonage/server-sdk')
const vonage = new Vonage({
  apiKey: "4542a449",
  apiSecret: "Tb2yD2lq9y6kP0Dg",
  applicationId: "d72e7e96-2f75-46a3-8e13-e11b9d239856",
  privateKey: "./private.key"
})

const makeVoiceCall = ({ from, to, text }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield vonage.calls.create({
            to: [{
              type: 'phone',
              number: to
            }],
            from: {
              type: 'phone',
              number: from
            },
            ncco: [
                {
                    "action": "talk",
                    "text": text,
                    "language": "pt-BR"
                  }
              ]
          }, (error, response) => {
            if (error) console.error(error)
            if (response) console.log(response)
          })
    }
    catch (err) {
        throw new AppError_1.default("ERR_MAKING_CALL");
    }
});
exports.default = makeVoiceCall;

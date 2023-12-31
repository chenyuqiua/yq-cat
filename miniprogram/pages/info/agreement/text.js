import { text } from "../../../config";

const { app_name } = text;

module.exports = {
  "text": `
本指引是${app_name}小程序开发者 （以下简称“开发者”）为处理你的个人信息而制定。

为了展示拍照排行榜，后台反馈信息，开发者将在获取你的明示同意后，收集你的微信昵称、头像、联系方式。
为了使用拍照识猫功能，开发者将在获取你的明示同意后，访问你的摄像头。
为了手动保存猫猫照片，开发者将在获取你的明示同意后，使用你的相册（仅写入）权限。
开发者 收集你选中的照片或视频信息，用于提交猫猫信息反馈到后台。

如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以授权弹框提示方式告知并征得你的明示同意。

开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
  `
}
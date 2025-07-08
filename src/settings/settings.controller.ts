import { Controller, Post, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {

    constructor(private settingService: SettingsService) {}

    @Post('account/change-email-verify')
    changeEmail(@Req() req) {
        const { token, code, email} = req.body
        return this.settingService.changeEmail(token, code, email);
    }

    @Post('account/connect-with-google')
    connectWithGoogle(@Req() req) {
        const { token, email} = req.body
        return this.settingService.connectWithGoogle(token, email);
    }

    @Post('account/set-new-password')
    setNewPassword(@Req() req) {
        const { token, new_password } = req.body
        return this.settingService.setNewPassword(token, new_password);
    }

    @Post('home-page')
    saveHomePageSetting(@Req() req) {
        const data = req.body
        return this.settingService.saveHomePageSetting(data);
    }
}

var CustomerMgr = require('dw/customer/CustomerMgr');
var Mail = require('dw/net/Mail');
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var Calendar = require('dw/util/Calendar');

function execute() {
    try {
        var cal = new Calendar(new Date());
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        var day = cal.get(Calendar.DAY_OF_MONTH);
        var month = cal.get(Calendar.MONTH) + 1;

   
        var profiles = CustomerMgr.searchProfiles("custom.birthdayCustom != NULL", "email asc");

        var sentCount = 0;

        
        while (profiles.hasNext()) {
            var profile = profiles.next();
           
            

            if (!profile.email || !profile.custom.birthdayCustom) {
                continue;
            }

            var bdayCal = new Calendar(profile.custom.birthdayCustom);
            var bDay = bdayCal.get(Calendar.DAY_OF_MONTH);
            var bMonth = bdayCal.get(Calendar.MONTH) + 1;

            if (bDay !== day || bMonth !== month) {
                continue;
            }

            var data = new HashMap();
            data.put("firstName", profile.firstName);

            var body = new Template("birthdayEmail.isml").render(data).text;

            var mail = new Mail();
            mail.addTo(profile.email);
            mail.setFrom("noreply@demandware.net");
            mail.setSubject("Happy Birthday!");
            mail.setContent(body, "text/html", "UTF-8");
            mail.send();

            sentCount++;
        }

        Logger.info("Birthday Job completed. Total Emails sent: " + sentCount);
        return new Status(Status.OK);

    } catch (e) {
        var err = e;
        Logger.error("Birthday Job Failed: " + e.toString());
        return new Status(Status.ERROR);
    }
}

module.exports = { execute: execute };

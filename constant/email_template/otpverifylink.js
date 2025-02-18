

function OTPVerifyLink(user, otpVerificationLink , otp){
  
    const verifyLink  = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your login</title>
      <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
    </head>

    <style>
      .button{
        position:relative;
        /* style|variant|weight|size/line-height|family */
        font: 500 14px Arial;
        letter-spacing: 0.5px;
        color:#fff !important;
        border: 0;
        border-radius: 5px;
        cursor:pointer;
        text-decoration:none;
    }

    .button{
        min-width: 100px;
        margin: 10px 5px;
        padding:8px 10px;
        background-color: #0092ba;/* for non linear-gradient browsers */
        background: linear-gradient(to bottom, #24A1C3 5%, #0092BB 100%) repeat scroll 0 0 #24A1C3;
    }

    .button{display:inline-block;min-width:80px;text-align:center;white-space:nowrap;}

    a.button:hover{
        background:linear-gradient(to bottom, #0092BB 5%, #24A1C3 100%) repeat scroll 0 0 #0092BB;
    }
    button:active{top:1px;}

    </style>
    
    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
      <table role="presentation"
        style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
        <tbody>
          <tr>
            <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
              <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                <tbody>
                  <tr>
                    <td style="padding: 40px 0px 0px;">
                      <div style="text-align: center;">
                        <div style="padding-bottom: 20px;"><img
                            src="https://assets.mailmeteorusercontent.com/tools/email-signature-generator/mailmeteor-logo.png" alt="Company"
                            style="width: 93px;"></div>
                      </div>
                      <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                        <div style="color: rgb(0, 0, 0); text-align: left;">
                          <h1 style="margin: 1rem 0">Verification code</h1>
                          <p style="padding-bottom: 16px">Dear ${user.name}</p>
                          <p style="padding-bottom: 16px">To complete your registration, please verify your email address by entering the following one-time password (OTP).</p>
                          <a class="button" href="${otpVerificationLink}" target="_blank"
                           style="background-color:rgb(0, 187, 255) ; text-decoration:none ; color:black ;padding:0.5rem ; padding-left:2rem;padding-right:2rem ; border-radius:0.5rem"
                          >Verify</a>

                          <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                          <p style="padding-bottom: 16px">This OTP is valid for 15 minutes.</p>
                          <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                        </div>
                      </div>
                      <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                        <p style="padding-bottom: 16px">Made with ♥ in Mumbai</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    
    </html>`

    return verifyLink ;
    
    
}




export default OTPVerifyLink
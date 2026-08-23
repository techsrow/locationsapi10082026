export const customerBookingEmail = (booking: any) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Confirmation</title>
</head>

<body style="
margin:0;
padding:0;
background:#f4f4f4;
font-family:Arial,Helvetica,sans-serif;
">

<div style="
padding:20px;
background:#f4f4f4;
">

<div style="
width:100%;
max-width:800px;
margin:auto;
background:#ffffff;
border-radius:10px;
overflow:hidden;
box-shadow:0 2px 12px rgba(0,0,0,0.08);
">

<!-- HEADER -->

<div style="
background:#5a0f2e;
padding:25px;
text-align:center;
">

<img
src="https://locationshub.in/images/loaction-hub-logo-final.svg"
alt="Locations Hub"
style="height:60px;max-width:220px;"
/>

</div>

<!-- TITLE -->

<div style="
padding:40px 30px;
text-align:center;
">

<h1 style="
margin:0;
font-size:38px;
font-weight:700;
color:#222;
line-height:1.2;
">

🎉 Congratulations!

<span style="
background:#f3d67b;
padding:4px 10px;
border-radius:4px;
">
We Are Booked For You
</span>

</h1>

<p style="
margin-top:15px;
font-size:17px;
line-height:1.7;
color:#666;
">

Hello <strong>${booking.firstName}</strong>,

<br><br>

Your booking has been successfully confirmed.

<br>

We look forward to hosting your shoot at Locations Hub.

</p>

</div>

<hr style="
border:none;
border-top:1px solid #ececec;
margin:0;
">

<!-- BOOKING DETAILS -->

<div style="
padding:30px;
">

<h2 style="
text-align:center;
font-size:28px;
color:#222;
margin:0 0 25px 0;
">

<span style="
background:#f3d67b;
padding:4px 10px;
border-radius:4px;
">
Booking
</span>

Details

</h2>

<table style="
width:100%;
border-collapse:collapse;
table-layout:fixed;
">

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Booking ID
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
${booking.bookingId}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Booked Package
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
${booking.product}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Booking Date
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
${booking.date}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Booked Slots
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
${booking.slots}
</td>
</tr>

</table>

</div>

<!-- IMPORTANT NOTES -->

<div style="
padding:30px;
color:#555;
">

<h3 style="
margin-top:0;
font-size:24px;
color:#222;
">
Please Note
</h3>

<ol style="
padding-left:25px;
line-height:2;
font-size:15px;
">

<li>Timings cannot be shifted.</li>

<li>Please reach 20 minutes prior for payment and booking formalities.</li>

<li>Dues + Security Deposit (Refundable) must be paid before the shoot.</li>

<li>Please carry a valid Government ID proof.</li>

<li>Outside food and beverages are not allowed.</li>

<li>All sets and props are on a sharing basis. Cooperative behaviour is expected.</li>

<li>
Download the Google Location offline before starting your journey.
<br>
<a href="https://maps.app.goo.gl/6pPZoJ6wMU8tsGET6">
Open Map
</a>
</li>

<li>
Locations Hub Manager
<br>
Prashant: +91 8169232114
</li>

</ol>

</div>

<hr style="
border:none;
border-top:1px solid #ececec;
margin:0;
">

<!-- SUPPORT -->

<div style="
padding:40px 30px;
background:#fafafa;
text-align:center;
">

<h2 style="
margin-top:0;
color:#222;
">
Need Assistance?
</h2>

<p style="
line-height:1.8;
color:#555;
margin:0;
">

If you have any questions regarding your booking,
please contact us.

<br><br>

📞 +91 8169232114

<br><br>

📧 info@locationshub.in

</p>

</div>

<!-- FOOTER -->

<div style="
text-align:center;
padding:25px;
background:#fafafa;
color:#999;
font-size:13px;
">

Copyright © ${new Date().getFullYear()}
Locations Hub.
All Rights Reserved.

</div>

</div>

</div>

</body>
</html>
`;
};
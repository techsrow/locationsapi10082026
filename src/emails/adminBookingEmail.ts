// export const adminBookingEmail = (booking: any) => {

// return `

// <div style="background:#f4f4f4;padding:40px;font-family:Arial,Helvetica,sans-serif">

// <div style="max-width:700px;margin:auto;background:white;border-radius:6px;overflow:hidden">

// <!-- HEADER -->

// <div style="background:#5a0f2e;padding:18px;text-align:center">
// <img src="https://locationshub.in/images/loaction-hub-logo-final.svg" alt="Locations Hub" style="height:40px"/>
// </div>

// <!-- TITLE -->

// <div style="padding:30px;text-align:center">

// <h1 style="margin:0;color:#333;font-weight:600">
// New <span style="background:#f3d67b;padding:3px 6px">Booking</span>
// </h1>

// <p style="color:#666;margin-top:10px">
// You have received a booking from <strong>${booking.name}</strong>.
// The booking details are below.
// </p>

// </div>

// <hr style="border:none;border-top:1px solid #eee">

// <!-- BOOKING DETAILS -->

// <div style="padding:10px">

// <h2 style="text-align:center;color:#333">
// <span style="background:#f3d67b;padding:3px 6px">Booking</span> Details
// </h2>

// <table style="width:100%;border-collapse:collapse;margin-top:20px">

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Booking ID
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ${booking.bookingId}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Name
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ${booking.name}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Booking Date
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ${booking.date}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Package
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ${booking.package}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Timings
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ${booking.slots}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Cost
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ₹${booking.cost}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Total
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ₹${booking.total}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Payment Method
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ${booking.paymentMethod}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Advance Paid (Inc GST)
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ₹${booking.advance}
// </td>
// </tr>

// <tr>
// <td style="padding:10px;border-bottom:1px solid #eee;color:#555">
// Dues (Excl GST)
// </td>
// <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">
// ₹${booking.due}
// </td>
// </tr>

// </table>

// </div>

// <!-- NOTES -->

// <div style="padding:10px;color:#555">

// <h3>Please note :</h3>

// <ol style="line-height:1.7">

// <li>Timings cannot be shifted.</li>

// <li>Please reach 20 mins prior for Payment and Booking formalities.</li>

// <li>Dues + Deposit (Refundable) to be paid before the shoot.</li>

// <li>Please carry your Id Proof.</li>

// <li>Outside Food and Beverages are not allowed.</li>

// <li>All Sets & Props are on sharing basis, cooperative behavior is expected.</li>

// <li>
// Download Google location offline before starting.  
// <a href="https://maps.app.goo.gl/6pPZoJ6wMU8tsGET6">
// Open Map
// </a>
// </li>

// <li>
// Locations Hub Manager  
// Prashant +91 8169232114
// </li>

// </ol>

// </div>

// <hr style="border:none;border-top:1px solid #eee">

// <!-- BILLING ADDRESS -->

// <div style="padding:30px;text-align:center">

// <h2>Billing Address</h2>

// <p style="line-height:1.7;color:#555">

// ${booking.name}<br>
// ${booking.address}<br>
// ${booking.city} ${booking.postcode}<br>
// ${booking.state}<br>

// <a href="tel:${booking.phone}">
// ${booking.phone}
// </a>

// <br><br>

// <a href="mailto:${booking.email}">
// ${booking.email}
// </a>

// </p>

// </div>

// <!-- FOOTER -->

// <div style="text-align:center;padding:20px;color:#999">

// <p>Copyright © Locations Hub</p>

// </div>

// </div>

// </div>

// `;
// };

export const adminBookingEmail = (booking: any) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Notification</title>
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

🎉 Yay!

<span style="
background:#f3d67b;
padding:4px 10px;
border-radius:4px;
">
We Have a Booking
</span>

</h1>

<p style="
margin-top:15px;
font-size:17px;
line-height:1.7;
color:#666;
">

A new booking has been received from
<strong>${booking.name}</strong>.

<br><br>

Please review the booking details below.

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

<table
style="
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
color:#222;
">
${booking.bookingId}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Name
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
${booking.name}
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
Package
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
${booking.package}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Timings
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

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Package Cost
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
₹${booking.packageCost}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Booking Cost
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
₹${booking.bookingCost}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
GST on Booking Cost (18%)
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
₹${booking.gstAmount}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Total Paid
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:700;
color:#0b7a24;
">
₹${booking.totalPaid}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Balance Due
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:700;
color:#c0392b;
">
₹${booking.due}
</td>
</tr>

<tr>
<td style="padding:16px;border-bottom:1px solid #eee;color:#555;">
Payment Method
</td>

<td style="
padding:16px;
border-bottom:1px solid #eee;
text-align:right;
font-weight:600;
">
${booking.paymentMethod}
</td>
</tr>

</table>

</div>

<!-- NOTES -->

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

<li>Please reach 20 mins prior for payment and booking formalities.</li>

<li>Dues + Deposit (Refundable) to be paid before the shoot.</li>

<li>Please carry your ID Proof.</li>

<li>Outside Food and Beverages are not allowed.</li>

<li>All Sets & Props are on sharing basis. Cooperative behavior is expected.</li>

<li>
Download Google Location Offline before starting.
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

<!-- BILLING -->

<div style="
padding:40px 30px;
background:#fafafa;
text-align:center;
">

<h2 style="
margin-top:0;
color:#222;
">
Billing Address
</h2>

<p style="
line-height:1.8;
color:#555;
margin:0;
">

${booking.name}<br>

${booking.address}<br>

${booking.city} ${booking.postcode}<br>

${booking.state}

<br><br>

<a href="tel:${booking.phone}">
${booking.phone}
</a>

<br><br>

<a href="mailto:${booking.email}">
${booking.email}
</a>

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
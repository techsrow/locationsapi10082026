export const abandonedBookingEmail = (booking: any) => {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;">

<div style="max-width:700px;margin:auto;background:#fff;padding:30px;border-radius:10px;">

<h2 style="color:#c0392b;">
⚠ Abandoned Checkout Alert
</h2>

<p>
A customer started a booking but did not complete payment.
</p>

<table style="width:100%;border-collapse:collapse;">

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Booking ID
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${booking.bookingId}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Customer
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${booking.firstName || ""} ${booking.lastName || ""}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Phone
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${booking.phone || "-"}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Email
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${booking.email || "-"}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Package
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${booking.product?.name || "-"}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Shoot Date
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${new Date(booking.bookingDate).toLocaleDateString("en-GB")}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Source
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${booking.source || "-"}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Notes
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${booking.notes || "-"}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Created At
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${new Date(booking.createdAt).toLocaleString("en-GB")}
</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;">
Lock Expired
</td>
<td style="padding:10px;border-bottom:1px solid #eee;">
${new Date(booking.lockExpiresAt).toLocaleString("en-GB")}
</td>
</tr>

</table>

</div>

</body>
</html>
`;
};
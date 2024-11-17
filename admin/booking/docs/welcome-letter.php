<?php
require '../../../require/modules.php';
require "../../../require/admin/sessionvariables.php";
require '../../../include/admin/common.php';

if (isset($_GET['id'])) {
  $bookingid = $_GET['id'];
  $_SESSION['bookingid'] = $_GET['id'];
} else {
  $bookingid = $_SESSION['id'];
}

$BookingSql = "SELECT * FROM bookings where bookingid='$bookingid'";
$customer_id = FETCH($BookingSql, "customer_id");
$partner_id = FETCH($BookingSql, "partner_id");
$CoAllotySql = "SELECT * FROM booking_alloties where BookingAllotyMainBookingId='$bookingid' and BookingAllotyFullName!=''";
$CustomerSql = "SELECT * FROM users where id='$customer_id'";
$PartnerSql = "SELECT * FROM users where id='$partner_id'";
$CustomerAddress = "SELECT * FROM user_address where user_id='$customer_id'";
$PartnerAddress = "SELECT * FROM user_address where user_id='$partner_id'";
$project_unit_id = FETCH($BookingSql, "project_unit_id");

//unit details
$UnitSQL = "SELECT * FROM project_units where project_units_id='$project_unit_id'";
$project_block_id = FETCH($UnitSQL, "project_block_id");
$project_floor_id = FETCH($UnitSQL, "project_floor_id");

$project_block_name = FETCH("SELECT project_block_name FROM project_blocks where project_block_id='$project_block_id'", "project_block_name");
$projects_floor_name = FETCH("SELECT projects_floor_name from projects_floors WHERE projects_floors_id='$project_floor_id'", "projects_floor_name");
$projects_floors_tag = FETCH("SELECT projects_floors_tag from projects_floors WHERE projects_floors_id='$project_floor_id'", "projects_floors_tag");
$project_unit_bhk_type = FETCH("SELECT project_unit_bhk_type FROM project_units where project_units_id='$project_unit_id'", "project_unit_bhk_type");
$project_unit_highlights = FETCH("SELECT project_unit_highlights FROM project_units where project_units_id='$project_unit_id'", "project_unit_highlights");
$unit_broker_rate = FETCH("SELECT unit_broker_rate FROM project_units where project_units_id='$project_unit_id'", "unit_broker_rate");

//other variables
$area = FETCH($BookingSql, "unit_area");
$areaint = GetNumbers($area);

//check re-sale or transfer status of current bookings
$CheckSql = "SELECT * FROM booking_resales where booking_main_id='$bookingid'";
$CheckStatus = CHECK($CheckSql);
if ($CheckStatus != null) {
  $DocTitle = "Re-Welcome Letter";
} else {
  $DocTitle = "Welcome Letter";
}

$inputString = FETCH($BookingSql, "unit_name"); // Your input string

// Use preg_replace to remove alphabets and get only numbers
$numbersOnly = preg_replace("/[^0-9]/", "", $inputString);
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>Welcome Letter</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <style>
    section {
      width: 800px !important;
      height: 1000px !important;
    }
  </style>
</head>

<body onload="doConvert()" style=" font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI' , Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans' , 'Helvetica Neue' , sans-serif !important;margin-left:1.5rem;">
  <section style="padding:0.5rem;margin:0% auto;display:block;">
    <div>
      <?php include "../../../include/export/rc-header.php"; ?>
      <h2 style="text-align:center;"><?PHP echo $DocTitle; ?> <br>
        <hr style="width:45%;">
        </h4>
        <p style="display:flex;justify-content:space-between;font-size:14px;">
          <span>
            <span><b>Booking Date :</b> <?php echo DATE("d M, Y", strtotime(FETCH($BookingSql, "booking_date"))); ?></span><br>
            <span><b>Unit No:</b> <?php echo $numbersOnly; ?> (<?php echo $project_unit_bhk_type; ?>) /<?php echo $projects_floor_name; ?>/<?php echo $project_block_name; ?></span><br>
          </span>
          <span>
            <b>Print Date : </b> <?php echo date("d M, Y h:m A"); ?><br>
            <b>BookingID : </b> B<?php echo $_GET['id']; ?>/<?php echo date("m/Y", strtotime(FETCH($BookingSql, "created_at"))); ?>
          </span>
        </p>
    </div>
    <div style="font-size:14px !important;">
      <div style="display:flex;justify-content:space-between;">
        <p>
          <b>Allotee Details</b><br>
          <?php echo FETCH($CustomerSql, "name"); ?>,<br>
          <?php echo FETCH($CustomerSql, "father_name"); ?><br>
          <?php
          echo FETCH($CustomerAddress, "user_street_address") . " ";
          echo FETCH($CustomerAddress, "user_area_locality") . "<br>";
          echo FETCH($CustomerAddress, "user_city") . " ";
          echo FETCH($CustomerAddress, "user_state") . "<br>";
          echo FETCH($CustomerAddress, "user_pincode") . " ";
          echo FETCH($CustomerAddress, "user_country");
          ?>
        </p>
        <?php $Check = CHECK($CoAllotySql);
        if ($Check != null) { ?>
          <p style="float:right;">
            <b>Co-Allotee Details</b><br>
            <?php echo FETCH($CoAllotySql, "BookingAllotyFullName"); ?>,<br>
            <?php echo FETCH($CoAllotySql, "BookingAllotyRelation"); ?><br>
            <?php
            echo FETCH($CoAllotySql, "BookingAllotyStreetAddress") . " ";
            echo FETCH($CoAllotySql, "BookingAllotyArea") . "<br>";
            echo FETCH($CoAllotySql, "BookingAllotyCity") . " ";
            echo FETCH($CoAllotySql, "BookingAllotyState") . "<br>";
            echo FETCH($CoAllotySql, "BookingAllotyPincode") . " ";
            echo FETCH($CoAllotySql, "BookingAllotyCountry") . "";
            ?>
          </p>
        <?php } ?>
      </div>
      <p>
        <b>Dear Mr/s <?php echo FETCH($CustomerSql, "name"); ?></b><br>
        Greetings!
        It is indeed a great pleasure to welcome you in our <?php echo company_name; ?> Family. We are
        honoured to take this opportunity to introduce ourselves at a starting point of our
        long-term relationship with you in our Project <b><?php echo company_name; ?></b> having <b> "Unit No : <?php echo $numbersOnly; ?> - <?php echo $project_unit_bhk_type; ?>" <?php echo $projects_floor_name; ?> <?php echo $project_block_name; ?></b> situated at <b>
          <?php echo company_address2; ?></b>. <br><br>
        <?php
        if ($CheckStatus == null) { ?>
          We are glad to inform you that we have received your Application Form for <b> Unit No : <?php echo $numbersOnly . " - " . $project_unit_bhk_type . " " . $projects_floor_name . " " . $project_block_name; ?></b> , having area: <b><?php echo FETCH($BookingSql, "unit_area"); ?></b>,
          in <b><?php echo company_address2; ?></b>. <br><br>
        <?php } else { ?>
          We are glad to inform you that we have received your Application Form and transfer deed date <b><?php echo DATE_FORMATE2("d M, Y", FETCH($BookingSql, "booking_date")); ?></b> for <b> Plot No : <?php echo $numbersOnly; ?></b> , having area: <b><?php echo FETCH($BookingSql, "unit_area"); ?></b>,
          in <b><?php echo company_address2; ?></b>. <br><br>
        <?php } ?>
        Also we would like to share your details along with this letter which has been
        provided by you. In case if there is any discrepancy or mismatch in the details
        attached in <b>Annexure – A</b>, we request you to please provide / revert the correct
        details within 10 days from the date of receiving this letter to enable us to have a
        better communication with you.<br><br>
        Request you to please send us back the attached acknowledgement sheet along
        with all the correct details and incomplete documents, not submitted earlier, if any.
        In case of no response or receipt of the said acknowledgement sheet from you
        within stipulated period of 10 days then, we will presume that the information
        provided in the sheet is correct and authentic.
      </p>
    </div>
    <div style="font-size:14px !important;">
      <p>
        For any query, you can reach our customer care [<?php echo company_email; ?>] at our
        office.<br><br>
        We are looking forward to serve you with the best of our services.<br><br>
        Warm regards,<br>
        For <b><?php echo company_name; ?></b><br>
        <br><br><br><br>
        (Authorised Signatory)
      </p>
      <br>
    </div>
  </section>

  <section style="height:100%;padding:0.5rem;margin:0% auto;display:block;">
    <br><br><br><br><br><br><br><br><br>
    <div style="font-size:14px !important;">
      <h3 style="text-align:center;margin-top:0px;">Booking Details <b>Annexure - A</b></h3>
      <table style="width:100%; box-shadow: 0px 0px 1px black;">
        <tr style="background-color:#87ceeb38;text-align:center;color:black;">
          <td colspan="4" style="padding:5px;">
            Verification Details of Customer Details
          </td>
        </tr>
        <tr style="background-color:#87ceeb38;">
          <th>Sno</th>
          <th>Particular</th>
          <th>Details</th>
          <th>Remarks</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Reference No:</td>
          <td>B<?php echo $bookingid; ?>/<?php echo date("m/Y", strtotime(FETCH($BookingSql, "created_at"))); ?> - Unit No: <?php echo $numbersOnly; ?></td>
          <td></td>
        </tr>
        <tr>
          <td>2</td>
          <td>Project Name</td>
          <td><?php echo FETCH($BookingSql, "project_name"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>3</td>
          <td>Block Number</td>
          <td><?php echo $project_block_name; ?></td>
          <td></td>
        </tr>
        <tr>
          <td>4</td>
          <td>Floor Number</td>
          <td><?php echo $projects_floor_name; ?></td>
          <td></td>
        </tr>
        <tr>
          <td>5</td>
          <td>ROOMs Type</td>
          <td><?php echo $project_unit_bhk_type; ?></td>
          <td></td>
        </tr>
        <tr>
          <td>6</td>
          <td>Date of Booking</td>
          <td><?php echo DATE_FORMATE2("d M, Y", FETCH($BookingSql, "booking_date")); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>7</td>
          <td>*First Applicant Name</td>
          <td><?php echo FETCH($CustomerSql, "name"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>8</td>
          <td>Co-Applicant (if any)</td>
          <td><?php echo FETCH($CoAllotySql, "BookingAllotyFullName", "No"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>9</td>
          <td>Area</td>
          <td><?php echo FETCH($BookingSql, "unit_area"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>10</td>
          <td>Payment Plan</td>
          <td>DLP</td>
          <td></td>
        </tr>
        <tr>
          <td>11</td>
          <td>*Mobile No</td>
          <td><?php echo FETCH($CustomerSql, "phone", "-"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>12</td>
          <td>*Email-Id</td>
          <td><?php echo FETCH($CustomerSql, "email", "-"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>13</td>
          <td>*ID Proof PAN</td>
          <td><?php echo FETCH("SELECT * FROM user_documents where document_name like '%PAN CARD%' and user_id='$customer_id'", "user_documents_no"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>14</td>
          <td>*Address Proof</td>
          <td><?php echo FETCH("SELECT * FROM user_documents where document_name like '%Adhaar card%' and user_id='$customer_id'", "user_documents_no"); ?></td>
          <td></td>
        </tr>
        <tr>
          <td>15</td>
          <td>*Booking Form Received!</td>
          <td><b>YES</b></td>
          <td></td>
        </tr>
      </table>
      <p>
        *Indicates mandatory field.<br>
        Please do send this acknowledgement letter back to us duly signed by All
        Applicant(s) along with the incomplete documents and details, duly SELF
        ATTESTED BY ALL THE APPLICANTS.<br><br>
      </p>
      <br><br>
      <div style="display:flex; justify-content: space-between;">
        <p>
          ___________________________<br>
          Signature of First Applicant<br>
          Date: -----.---.-----
        </p>
        <p>
          ___________________________<br>
          Signature of Co- Applicant<br>
          Date: -----.---.-----
        </p>
      </div>
      <br>
    </div>
  </section>

  <script>
    function doConvert() {
      var numberInput = <?php echo FETCH($BookingSql, "unit_area"); ?>;


      var oneToTwenty = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ',
        'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '
      ];
      var tenth = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

      if (numberInput.toString().length > 7) return myDiv.innerHTML = 'overlimit';
      console.log(numberInput);
      //let num = ('0000000000'+ numberInput).slice(-10).match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      var num = ('0000000' + numberInput).slice(-7).match(/^(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);
      console.log(num);
      if (!num) return;

      var outputText = num[1] != 0 ? (oneToTwenty[Number(num[1])] || `${tenth[num[1][0]]} ${oneToTwenty[num[1][1]]}`) + ' million ' : '';

      outputText += num[2] != 0 ? (oneToTwenty[Number(num[2])] || `${tenth[num[2][0]]} ${oneToTwenty[num[2][1]]}`) + 'hundred ' : '';
      outputText += num[3] != 0 ? (oneToTwenty[Number(num[3])] || `${tenth[num[3][0]]} ${oneToTwenty[num[3][1]]}`) + ' thousand ' : '';
      outputText += num[4] != 0 ? (oneToTwenty[Number(num[4])] || `${tenth[num[4][0]]} ${oneToTwenty[num[4][1]]}`) + 'hundred ' : '';
      outputText += num[5] != 0 ? (oneToTwenty[Number(num[5])] || `${tenth[num[5][0]]} ${oneToTwenty[num[5][1]]} `) : '';

      document.getElementById("inwords").innerHTML = outputText;
    }
  </script>
</body>

</html>
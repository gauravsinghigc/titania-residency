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

$getpayments = SELECT("SELECT *, payments.created_at AS 'payment_created_at' FROM payments, bookings where payments.bookingid=bookings.bookingid and bookings.bookingid='$bookingid' order by payments.payment_id DESC");
$net_paid_amount2 = 0;
$SerialNo = 0;
while ($FetchAllPayments = mysqli_fetch_array($getpayments)) {
  $SerialNo++;
  $payment_id = $FetchAllPayments['payment_id'];
  $bookingid = $FetchAllPayments['bookingid'];
  $booking_date = $FetchAllPayments['booking_date'];
  $payment_date = date("d M, Y", strtotime($FetchAllPayments['payment_date']));
  $payment_mode = $FetchAllPayments['payment_mode'];
  $payment_amount = $FetchAllPayments['payment_amount'];
  $payment_created_at = $FetchAllPayments['payment_created_at'];
  $slip_no = $FetchAllPayments['slip_no'];
  $payment_id = $FetchAllPayments['payment_id'];
  $created_at = $FetchAllPayments['created_at'];
  $customer_id = $FetchAllPayments['customer_id'];
  $net_paid_amount = $FetchAllPayments['net_paid'];
  $partner_id = $FetchAllPayments['partner_id'];
  $payment_type = $FetchAllPayments['payment_type'];
  $clearing_date2 = $FetchAllPayments['clearing_date'];
  $emi_months = $FetchAllPayments['emi_months'];
  $net_paid_amount2 += (int)$net_paid_amount;

  if ($payment_mode == "check") {
    $payment_mode = "Cheque";
  } else {
    $payment_mode = $payment_mode;
  }

  //select customer details
  $SelectCustomers = SELECT("SELECT * FROM users where id='$customer_id'");
  $CustomerDetails = mysqli_fetch_array($SelectCustomers);
  $CustomerName = $CustomerDetails['name'];

  //agent details
  $SelectAgents = SELECT("SELECT * FROM users where id='$partner_id'");
  $AgentDetails = mysqli_fetch_array($SelectAgents);
  $AgentName = $AgentDetails['name'];


  $GetPAYMENTS = SELECT("SELECT * FROM payments where payment_id='$payment_id' and bookingid='$bookingid' ORDER BY payment_id  DESC");
  $payments = mysqli_fetch_array($GetPAYMENTS);
  $payment_amount = $payments['payment_amount'];
  $payment_mode = $payments['payment_mode'];
  $slip_no = $payments['slip_no'];
  $remark = $payments['remark'];
  $payment_created_date = date("M, Y", strtotime($payments['payment_date']));
  $payment_created_date_full = date("d M, Y", strtotime($payments['payment_date']));
  $payment_created_date_full2 = date("dmY", strtotime($payments['payment_date']));
  $paymentcreatedat = $payments['created_at'];
  $payment_id = $payments['payment_id'];

  //payment modes
  if ($payment_mode == "check") {
    $SELECT_check_payments = SELECT("SELECT * from check_payments where payment_id='$payment_id'");
    $check_payments = mysqli_fetch_array($SELECT_check_payments);
    $txnid = $check_payments['check_payments'];
    $checknumber = $check_payments['checknumber'];
    $checkissuedto = $check_payments['checkissuedto'];
    $bankName = $check_payments['bankName'];
    $ifsc = $check_payments['ifsc'];
    $payment_status = $check_payments['checkstatus'];
    $check_issued_at = date("d M, Y", strtotime($check_payments['created_at']));
    $payment_note = "<br>by check no: $checknumber issued on $check_issued_at for $checkissuedto through $bankName | $ifsc e.i $payment_status";
  } else if (
    $payment_mode == "banking"
  ) {
    $SELECT_online_payments = SELECT("SELECT * FROM online_payments where payment_id='$payment_id'");
    $online_payments = mysqli_fetch_array($SELECT_online_payments);
    $txnid = $online_payments['online_payments_id'];
    $OnlineBankName = $online_payments['OnlineBankName'];
    $transactionId = $online_payments['transactionId'];
    $payment_details = $online_payments['payment_details'];
    $payment_mode = $online_payments['payment_mode'];
    $payment_status = $online_payments['transaction_status'];
    $payment_note = "<br>by Online Banking : Bank Name:$OnlineBankName, TxnId: $transactionId, Details: $payment_details, Status: $payment_status";
  } else if (
    $payment_mode == "cash"
  ) {
    $SELECT_cash_payments = SELECT("SELECT * FROM cash_payments where payment_id='$payment_id'");
    $cash_payments = mysqli_fetch_array($SELECT_cash_payments);
    $txnid = $cash_payments['cash_payments'];
    $cashreceivername = $cash_payments['cashreceivername'];
    $cashamount = $cash_payments['cashamount'];
    $payment_status = "done!";
    $payment_note = "<br>Cash " . $payment_amount . " is received by $cashreceivername on " . date("d M, Y h:m A", strtotime($paymentcreatedat));
  }
  $paymentreferenceid = "B$bookingid/P$payment_id/T$txnid/D$payment_created_date_full2";
}

//check re-sale or transfer status of current bookings
$CheckSql = "SELECT * FROM booking_resales where booking_main_id='$bookingid'";
$CheckStatus = CHECK($CheckSql);
if ($CheckStatus != null) {
  $DocTitle = "Re-Allotment Letter";
  $TextName = "re-allotment";
} else {
  $DocTitle = "Allotment Letter";
  $TextName = "allotment";
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
  <title>Allotment Letter</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <style>
    section {
      width: 800px !important;
      height: 1000px !important;
    }
  </style>
</head>

<body onload="doConvert()" style=" font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI' , Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans' , 'Helvetica Neue' , sans-serif !important;margin-left:1.5rem;">
  <section style="padding:0.5rem;margin:2% auto;display:block;">
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
          <b><?php echo FETCH($CustomerSql, "name"); ?></b>,<br>
          <?php echo FETCH($CustomerSql, "father_name"); ?><br>
          <?php
          echo FETCH($CustomerAddress, "user_street_address") . " ";
          echo FETCH($CustomerAddress, "user_area_locality") . " <br>";
          echo FETCH($CustomerAddress, "user_city") . " ";
          echo FETCH($CustomerAddress, "user_state") . " <br>";
          echo FETCH($CustomerAddress, "user_pincode") . " ";
          echo "<br>";
          echo FETCH($CustomerSql, "phone") . "<BR>";
          echo FETCH($CustomerSql, "email") . "<BR>";
          ?>
        </p>
        <?php $Check = CHECK($CoAllotySql);
        if ($Check != null) { ?>
          <p style="float:right;">
            <b>Co-Allotee Details</b><br>
            <b> <?php echo FETCH($CoAllotySql, "BookingAllotyFullName"); ?></b>,<br>
            <?php echo FETCH($CoAllotySql, "BookingAllotyRelation"); ?><br>
            <?php
            echo FETCH($CoAllotySql, "BookingAllotyStreetAddress") . " ";
            echo FETCH($CoAllotySql, "BookingAllotyArea") . " <br>";
            echo FETCH($CoAllotySql, "BookingAllotyCity") . " ";
            echo FETCH($CoAllotySql, "BookingAllotyState") . " <br>";
            echo FETCH($CoAllotySql, "BookingAllotyPincode") . " <br>";
            echo FETCH($CoAllotySql, "BookingAllotyPhoneNumber") . " <BR>";
            echo FETCH($CoAllotySql, "BookingAllotyEmail") . " ";
            ?>
          </p>
        <?php } ?>
      </div>


      <p><b>Subject:</b> Allotment of <b> Unit No : <?php echo $numbersOnly; ?> - <?php echo $project_unit_bhk_type; ?>, <?php echo $projects_floor_name; ?>, <?php echo $project_block_name; ?> </b> against your booking in our “<?php echo UpperCase(company_name); ?>”, situated at
        <?php echo company_address2; ?>.</p>
      <h4>Dear Allotee,</h4>
      <h3>Heartily Congratulations!</h3>
      <p>
        We are delighted to inform You that in furtherance of your booking for <?php echo $TextName; ?> of
        a unit no : <?php echo $numbersOnly; ?> - <?php echo $project_unit_bhk_type; ?>, <?php echo $projects_floor_name; ?> <?php echo $project_block_name; ?> in <b>"<?php echo FETCH($BookingSql, "project_name"); ?>"</b> Project, situated at <b><?php echo company_address2; ?></b>.
        Please note that, you have been allotted a <b> Unit No : <?php echo $numbersOnly . " - " . $project_unit_bhk_type . " " . $projects_floor_name . " " . $project_block_name; ?></b> , having
        area: <b><?php echo FETCH($BookingSql, "unit_area"); ?></b> in accordance with the terms
        and conditions of the Application Form.<br><br>

        Please also be informed that <?php echo $TextName; ?> of the said unit is strictly subject to clearance of due payments/ outstanding, if any and
        timely payments of future instalments. Company reserves the right to cancel the <?php echo $TextName; ?> in case of failure to make payment in time. Also, upon sale of 75% of the total units, an association of the allottees will be formed and the information regarding the same will be provided later on and it is mandatory for each allottee to get himself/herself enrolled as a member of registered association under this project.
        <br><br>
        You are requested to acknowledge the <?php echo $TextName; ?> Letter of the abovementioned said Unit allotted to you by signing in the office copy of the <?php echo $TextName; ?> Letter/Unit Buyers Agreement and send us back the same within 15 days within the date of the letter in case of any issue. If the letter is not sent back to us, it shall be deemed to be accepted by you. We request you to quote your Unit No. in all your future correspondence with us.
      </p>

      <div style="font-size:14px !important;">
        <p>
          We are looking forward to have a long-lasting relationship with you. For any further
          information please, feel free to mail our customer care office on <b>customer care
            [<?php echo company_email; ?>]</b> at our office.
        </p>
        <p>
          <b>WARM REGARDS</b>
        </p>
        <p>For <?php echo company_name; ?><br><br>
        </p>
        <br>
        <p>
          (Authorised Signatory)
        </p>
        <p style="text-align:right;margin-top:-3rem;">
          <span style="color:lightgrey;">[SIGNATURE OF
            ALLOTTEE]</span><br><br>
          Accepted By -----<?php echo FETCH($CustomerSql, "name"); ?>-----
        </p>
        <br><br>
        <p>
          <b>NOTE:</b><br>
          ❖ Please ensure that you indicate your name, CRN No., Unit No and the telephone number/ mobile number on
          the reverse of the cheque/ draft submitted by you.<br>
          ❖ Kindly inform us regarding any change of your address, telephone no., email ID immediately, if any.<br>
        </p>
        <br>
      </div>
  </section>

  <script>
    function doConvert() {
      var numberInput = <?php echo FETCH($BookingSql, "unit_area"); ?>;


      var oneToTwenty = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ',
        'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Sighteen ', 'Nineteen '
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

      document.getElementById("inwords").innerHTML = "Rupees " + outputText;
    }
  </script>
</body>

</html>
<?php
$Dir = "../../..";
require $Dir . '/require/modules.php';
require $Dir . "/require/admin/sessionvariables.php";
require $Dir . '/include/admin/common.php';

$PageName = "Edit Sliders";
if (isset($_GET['edit'])) {
 $sliderid = $_GET['edit'];
 $_SESSION['sliderid'] = $sliderid;
} else {
 $sliderid = $_SESSION['sliderid'];
}

$PageSqls = "SELECT * from sliders where sliderid='$sliderid'";
?>
<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="ie=edge">
 <title> <?php echo $PageName; ?> | <?php echo company_name; ?></title>
 <?php include $Dir . '/include/header_files.php'; ?>
</head>

<body>
 <div id="container" class="navbar-fixed mainnav-fixed mainnav-lg">
  <?php include '../../header.php'; ?>

  <!--END NAVBAR-->
  <div class="boxed">
   <div id="content-container">
    <div id="page-content">

     <div class="panel">
      <div class="panel-body">
       <div class="row">
        <div class="col-md-12">
         <h3 class="m-t-3"><i class="fa fa-file app-text"></i> <?php echo $PageName; ?></h3>
        </div>
       </div>

       <div class="row m-t-10">
        <div class="col-md-12">
         <form action="<?php echo CONTROLLER; ?>/slidercontroller.php" method="POST" enctype="multipart/form-data">
          <?php FormPrimaryInputs(true, [
           "sliderid" => $sliderid,
           "sliderimgold" => FETCH($PageSqls, "sliderimg"),
          ]); ?>
          <div class="row">
           <div class="col-md-10">
            <div class="form-group">
             <label for="ServiceTitle"> Slider Title</label>
             <input type="text" name="slidertitle" value="<?php echo FETCH($PageSqls, "slidertitle"); ?>" class="form-control" required="">
            </div>
            <?php UploadImageInput("sliderimgnew", "sliderimg1", "image/*", false, "", "null"); ?>
           </div>
           <div class="col-md-2">
            <img src="<?php echo STORAGE_URL; ?>/website/slider/<?php echo FETCH("$PageSqls", "sliderimg"); ?>" class="img-fluid w-25s">
           </div>
          </div>
          <div class="form-group">
           <label for="ServiceDesc">Slider Description</label>
           <textarea name="sliderdesc" class="form-control editor" rows="7"><?php echo html_entity_decode(SECURE(FETCH($PageSqls, "sliderdesc"), "d")); ?></textarea>
          </div>
          <div class="form-group">
           <label>Slider Status</label>
           <select name="Status" class="form-control">
            <?php InputOptions(["1" => "Active", "0" => "Inactive"], FETCH($PageSqls, "Status")); ?>
           </select>
          </div>
          <div>
           <button class="btn btn-sm btn-primary" name="UpdateSliders" type="submit">Update Slider</button>
           <a href="index.php" class="btn btn-sm btn-default">Back to All Sliders</a>
          </div>
         </form>
        </div>
       </div>
      </div>
     </div>

    </div>
   </div>
  </div>

  <!-- end -->
  <?php include  '../../sidebar.php'; ?>
  <?php include  '../../footer.php'; ?>
 </div>

 <?php include $Dir . '/include/footer_files.php'; ?>
</body>

</html>
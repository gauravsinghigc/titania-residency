<?php
require '../../require/modules.php';
require "../../require/admin/sessionvariables.php";
require '../../include/admin/common.php';


//page variable
$PageName = "Subscription";
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><?php echo $PageName; ?> | <?php echo $company_name; ?></title>
  <?php include '../../include/header_files.php'; ?>
</head>

<body>
  <div id="container" class="navbar-fixed mainnav-fixed mainnav-lg">
    <?php include '../header.php'; ?>

    <!-- main content area -->
    <div class="boxed">
      <!--CONTENT CONTAINER-->
      <!--===================================================-->
      <div id="content-container">
        <!--Page content-->
        <div id="page-content">
          <div class="row">
            <div class="col-md-12 col-lg-12 col-12">
              <div class="panel square">

                <div class="panel-body">
                  <div class="row">
                    <div class="col-md-12">
                      <h3 class="m-t-3"><i class="fa fa-refresh app-text"></i> <?php echo $PageName; ?></h3>
                    </div>
                    <div class="col-lg-12 col-md-12 col-12 col-sm-12 text-center">
                      <h2>Will be visible after deployment!</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>


    <!-- Modal  3-->
    <div class="modal fade square" id="add_data" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header app-bg text-white">
            <button type="button" class="close text-white m-r-8 m-t-1" data-dismiss="modal">&times;</button>
            <h4 class="modal-title text-white">Add Expanse</h4>
          </div>
          <div class="modal-body overflow-auto">
            <form action="../../controller/expansecontroller.php" method="POST" enctype="multipart/form-data">
              <input type="text" name="access_url" value="../admin/expanses/" hidden="">
              <div class="row">
                <div class="form-group col-12 col-md-12">
                  <label>Expanse Title</label>
                  <input type="text" name="expanses_title" class="form-control" required="" placeholder="Expanse Name">
                </div>
                <div class="form-group col-12 col-md-12">
                  <label>Expanse Tags</label>
                  <input name="expanses_tags" class="form-control" id="expanse_tags" required="">
                  <datalist id="browsers">
                    <?php
                    $expnasesSQL = SELECT("SELECT * from expanses");
                    while ($FETCHexpansesTags = mysqli_fetch_array($expnasesSQL)) {
                      $expanses_tags = $FETCHexpansesTags['expanses_tags']; ?>
                      <option value="<?php echo $expanses_tags; ?>"></option>
                    <?php } ?>
                  </datalist>
                </div>

                <div class="form-group col-6 col-md-6">
                  <label>Expanse/Billing Date</label>
                  <input type="date" name="expanse_date" class="form-control" require="" placeholder="12234">
                </div>
                <div class="form-group col-6 col-md-6">
                  <label>Expanse/Billing Amount</label>
                  <input class="form-control" placeholder="" name="expanse_amount" rows="3">
                </div>
                <div class="form-group col-12 col-md-12">
                  <label>Expanse Description</label>
                  <textarea type="text" name="expanse_description" class="form-control" required=""></textarea>
                </div>
                <div class="form-group col-12 col-md-12">
                  <label>Bill/Invoice/File</label>
                  <input type="FILE" name="expanse_file" class="form-control">
                </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="submit" name="create_new_expanses" value="<?php echo $company_id; ?>" class="btn btn-success" onclick="actionBtn('create_expanse', 'Saving...')" id="create_expanse">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>


    <!-- end -->
    <?php include '../sidebar.php'; ?>
    <?php include '../footer.php'; ?>
  </div>

  <?php include '../../include/footer_files.php'; ?>
</body>

</html>
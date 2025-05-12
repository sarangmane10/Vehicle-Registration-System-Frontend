app.controller(
  "registerController",
  function ($scope, loginService, registerService, $location) {
    // Registration
    let otp;
    $scope.customerData = {};
    $scope.form = {};

    $scope.handleRegistration = function () {
      // console.log($scope.form.checkPassword);
      $scope.customerData.otp = $scope.customerData.otp + "";
      if ($scope.customerData.password !== $scope.form.checkPassword) {
        alert("Passwords don't match!");
      } else if ($scope.customerData.otp !== otp) {
        console.log($scope.customerData.otp);
        console.log(otp);
        alert("Invalid OTP!");
      } else {
        if (
          loginService.getRole() === null ||
          loginService.getRole() !== "ADMIN"
        ) {
          $scope.customerData.userType = "USER";
        } else {
          $scope.customerData.userType = "ADMIN";
        }
        delete $scope.customerData.otp;
        registerService
          .registerCustomer($scope.customerData)
          .then(function (response) {
            alert("Registration successful!");
            if (loginService.getRole() == "ADMIN") {
              $location.path("/adminHome");
            }
            $location.path("/login");
          })
          .catch(function (error) {
            alert("Registration failed: " + error.data.message);
          });
      }
    };
    const enableBtn = setTimeout(() => {
      $scope.otpBtnStatus = false;
    }, 20000);

    $scope.sendOTP = (email) => {
      if (email === undefined) {
        alert("Enter valid email ID");
      } else {
        enableBtn;
        $scope.otpBtnStatus = true;
        otp = Math.floor(Math.random() * 10000) + "";
        for (let i = otp.length; i < 4; i++) {
          otp = "0" + otp;
        }
        let emailBody = {
          to: email,
          subject: "Vehicle Registration System Registration OTP",
          body:
            "OTP is " +
            otp +
            " \n do not share with any one \n OTP is valid for 5 min only",
        };
        registerService
          .sendOTP(emailBody)
          .then((res) => {
            console.log(res);
            alert("OTP sent successfully ");
          })
          .catch((error) => {
            alert("Error occured check log");
            console.log(error);
          });
      }
    };
  }
);

app.controller(
  "loginController",
  function ($rootScope, $scope, loginService, $location) {
    // Login
    $rootScope.isLoading;
    $scope.login = {};
    $scope.handleLogin = function () {
      $rootScope.isLoading = true;
      loginService
        .login($scope.login)
        .then(function (response) {
          // alert("controller login");
          // console.log(response);
          if (response.role === "USER") {
            $location.path("/customerHome");
          } else if (response.role === "ADMIN") {
            $location.path("/adminHome");
          }
        })
        .catch(function (error) {
          alert("Login failed: " + (error.data || "Invalid credentials"));
        })
        .finally(() => {
          $rootScope.isLoading = false;
        });
      $scope.login = {};
    };
  }
);

// controllers.js
app.controller("customerController", [
  "$scope",
  "$rootScope",
  "loginService",
  "adminService",
  "customerService",
  "$location",
  function (
    $scope,
    $rootScope,
    loginService,
    adminService,
    customerService,
    $location
  ) {
    if (loginService.getRole() === "USER") {
      // Initialize controller
      $scope.currentView = "dashboard";
      $scope.currentYear = new Date().getFullYear();
      $scope.registrationStep = 1;

      // Available vehicles for registration
      $scope.availableVehicles = [
        // {
        //   make: "Toyota",
        //   model: "Camry",
        //   type: "Sedan",
        //   year: 2023,
        //   engineType: "2.5L 4-cylinder",
        //   transmission: "Automatic",
        //   image:
        //     "https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2023/camry/1H1/1.png",
        // },
        // {
        //   make: "Honda",
        //   model: "Civic",
        //   type: "Sedan",
        //   year: 2023,
        //   engineType: "2.0L 4-cylinder",
        //   transmission: "Automatic",
        //   image:
        //     "https://www.honda.com/imgix/responsive/images/mlp/colorizer/2023/civic-sedan/1H1/1.png",
        // },
        // {
        //   make: "Ford",
        //   model: "F-150",
        //   type: "Truck",
        //   year: 2023,
        //   engineType: "3.5L V6 EcoBoost",
        //   transmission: "10-Speed Automatic",
        //   image:
        //     "https://www.ford.com/imgix/responsive/images/mlp/colorizer/2023/f150/1H1/1.png",
        // },
        // {
        //   make: "Tesla",
        //   model: "Model 3",
        //   type: "Sedan",
        //   year: 2023,
        //   engineType: "Electric",
        //   transmission: "Single-Speed",
        //   image:
        //     "https://www.tesla.com/imgix/responsive/images/mlp/colorizer/2023/model-3/1H1/1.png",
        // },
        // {
        //   make: "Jeep",
        //   model: "Wrangler",
        //   type: "SUV",
        //   year: 2023,
        //   engineType: "3.6L V6",
        //   transmission: "8-Speed Automatic",
        //   image:
        //     "https://www.jeep.com/imgix/responsive/images/mlp/colorizer/2023/wrangler/1H1/1.png",
        // },
        // {
        //   make: "Harley-Davidson",
        //   model: "Sportster",
        //   type: "Motorcycle",
        //   year: 2023,
        //   engineType: "1.2L V-Twin",
        //   transmission: "5-Speed",
        //   image:
        //     "https://www.harley-davidson.com/imgix/responsive/images/mlp/colorizer/2023/sportster/1H1/1.png",
        // },
      ];
      $scope.getAllVehicle = () => {
        $rootScope.isLoading = true;
        adminService
          .getVehicleDetails()
          .then((response) => {
            $scope.availableVehicles = response.filter(
              (res) => res.status === "Available"
            );
          })
          .then(() => {
            console.log($scope.availableVehicles);
          })
          .catch((error) => {
            alert("Failed..." + error.data);
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      // // Initialize form data
      $scope.resetRegistrationForm = function () {
        $scope.vehicleForm = {
          registrationNumber: "",
          make: "",
          model: "",
          type: "",
          year: "",
          color: "",
        };
        $scope.registrationStep = 1;
      };
      $scope.resetRegistrationForm();

      // Vehicle selection functions
      $scope.selectVehicle = function (vehicle) {
        $scope.vehicleForm = vehicle;
        $scope.registrationStep = 2;
        // console.log($scope.vehicleForm);
      };

      // $scope.showCustomVehicleForm = function () {
      //   $scope.vehicleForm = {
      //     registrationNumber: "",
      //     make: "",
      //     model: "",
      //     type: "",
      //     year: "",
      //     color: "",
      //   };
      //   $scope.registrationStep = 2;
      // };

      $scope.backToVehicleSelection = function () {
        $scope.registrationStep = 1;
      };

      // Rest of the controller remains the same as previous solution
      // (customer data, vehicles array, dashboard stats, etc.)

      // Sample customer data
      $scope.setProfile = () => {
        $scope.customer = loginService.getCustomer();
      };

      $scope.showVehicleDetails = (view, vehicle) => {
        $scope.setView(view);
        $scope.newVehicle = vehicle;
        console.log(vehicle);
      };

      //get all registered Vehicles details
      $scope.vehicles = [];
      $scope.getMyRegistrations = () => {
        $scope.vehicles = []; // Clear existing data
        $rootScope.isLoading = true;
        customerService
          .getAllRegistrations(loginService.getCustomer().id)
          .then((registrations) => {
            // Create an array of promises for all vehicle details
            const vehiclePromises = registrations.map((reg) => {
              return adminService
                .getVehicleDetailsById(reg.vehicleId)
                .then((vehicle) => {
                  // Combine registration and vehicle data
                  return {
                    id: reg.id,
                    registrationDate: reg.registrationDate,
                    expiryDate: reg.expiryDate,
                    registrationLocation: reg.registrationLocation,
                    status: reg.status,
                    model: vehicle.model,
                    brand: vehicle.brand,
                    yearOfManufacture: vehicle.yearOfManufacture,
                    power: vehicle.power,
                    mileage: vehicle.mileage,
                    fuelType: vehicle.fuelType,
                    vehicleType: vehicle.vehicleType,
                    engineType: vehicle.engineType,
                    transmission: vehicle.transmission,
                    price: vehicle.price,
                    // place:vehicle.registrationLocation
                  };
                });
            });

            // Wait for all vehicle details to be fetched
            return Promise.all(vehiclePromises);
          })
          .then((combinedData) => {
            $scope.vehicles = combinedData; // Assign all data at once
            console.log($scope.vehicles); // Now this will show complete data
            // $scope.$apply(); // Trigger AngularJS digest cycle if needed
            $scope.updateStats();
          })
          .catch((error) => {
            console.log("Error:", error);
            alert("Error Occurred. Please Check Console");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      $scope.editVehicle = (vehicle) => {
        // console.log(vehicle);
        // vehicle.place=vehicle.registrationLocation;
        // delete vehicle.registrationLocation;
        // alert(JSON.stringify(vehicle));
        // $scope.setView('register');
        //  $scope.selectVehicle(vehicle);
      };

      // Dashboard statistics
      $scope.getMyRegistrations();
      $scope.updateStats = function () {
        $scope.vehicleCount = $scope.vehicles.length;
        $scope.approvedCount = $scope.vehicles.filter(
          (v) => v.status === "APPROVED"
        ).length;
        $scope.pendingCount = $scope.vehicles.filter(
          (v) => v.status === "PENDING"
        ).length;

        // Recent activities
        $scope.recentActivities = $scope.vehicles
          .map((vehicle) => ({
            date: vehicle.registrationDate,
            type: "Registration",
            vehicle: `${vehicle.brand} ${vehicle.model}`,
            status: vehicle.status,
          }))
          .sort((a, b) => b.date - a.date);
      };
      $scope.updateStats();

      // View management
      $scope.setView = function (view) {
        $scope.currentView = view;
        if (view === "register") {
          $scope.resetRegistrationForm();
        }
      };

      // Vehicle registration
      $scope.registerVehicle = function () {
        let vehicle = {
          vehicleId: $scope.vehicleForm.id,
          customerId: loginService.getCustomer().id,
          registrationDate: new Date(),
          registrationLocation: $scope.vehicleForm.place,
          status: "PENDING",
        };
        $rootScope.isLoading = true;
        customerService
          .registerVehicle(vehicle)
          .then((response) => {
            $scope.setView("vehicles");
            alert("Vehicle registration submitted successfully!");
            $scope.getMyRegistrations();
          })
          .catch((error) => {
            console.log(error);
            alert("Error Occured. Please Check Log");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      //Customer Profile actions
      $scope.updateProfile = function () {
        if ($scope.customer.password === undefined) {
          $scope.customer.password = "";
        }
        if ($scope.customer.confirmPassword === undefined) {
          $scope.customer.confirmPassword = "";
        }
        if ($scope.customer.password !== $scope.customer.confirmPassword) {
          alert("Password don't match");
          console.log($scope.customer.password);
          console.log($scope.customer.confirmPassword);
        } else {
          delete $scope.customer.confirmPassword;
          delete $scope.customer.id;
          // $scope.customer.id=Number($scope.customer.id);
          console.log($scope.customer);
          $rootScope.isLoading = true;
          customerService
            .updateCustomer($scope.customer)
            .then((response) => {
              alert("Details Updated Successfully");
              loginService.setCustomer(response, loginService.getRole());
            })
            .catch((error) => {
              console.log(error);
              alert("Error Occured. Please Check Log");
            })
            .finally(() => {
              $rootScope.isLoading = false;
            });
        }
      };

      // Logout
      $scope.logout = function () {
        if (confirm("Are you sure you want to logout?")) {
          loginService.clearCustomer();
          $location.path("/login");
          // alert("Logged out successfully");
        }
      };
    } else {
      $location.path("/login");
    }
  },
]);

app.controller("adminController", [
  "$scope",
  "$rootScope",
  "adminService",
  "$location",
  "loginService",
  "customerService",
  function (
    $scope,
    $rootScope,
    adminService,
    $location,
    loginService,
    customerService
  ) {
    if (loginService.getRole() === "ADMIN") {
      $scope.currentView = "customers";
      $scope.showModal = false;
      // $scope.selectedCustomer=false;
      $scope.registration;
      $scope.customers;
      // Sample data
      adminService
        .getCustomerStat()
        .then((response) => {
          $scope.customers = response;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          alert("Error Occured. Please Check Log");
        });

      $scope.getAllCustomerStat = () => {
        $rootScope.isLoading = true;
        adminService
          .getCustomerStat()
          .then((response) => {
            $scope.customers = response;
          })
          .catch((error) => {
            console.log(error);
            alert("Error Occured. Please Check Log");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      $scope.allRegistrations = [];

      $scope.getAllRegistrations = () => {
        $rootScope.isLoading = true;
        adminService
          .getRegistrationStat()
          .then((response) => {
            $scope.allRegistrations = response;
          })
          .then(() => {
            // console.log($scope.allRegistrations);
            $scope.pendingRegistrations = $scope.allRegistrations.filter(
              (r) => r.status === "PENDING"
            );
          })
          .catch((error) => {
            console.log(error);
            alert("Error Occured. Please Check Log");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      $scope.vehicles = [];

      $scope.getAllVehicle = () => {
        $rootScope.isLoading = true;
        adminService
          .getVehicleDetails()
          .then((response) => {
            $scope.vehicles = response;
          })
          .then(() => {
            // console.log($scope.vehicles);
          })
          .catch((error) => {
            alert("Failed..." + error.data);
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      $scope.viewCustomer = (id) => {
        // alert(id);
        $scope.currentView = "customerDetail";
        // console.log($scope.currentView);
        $rootScope.isLoading = true;
        adminService
          .getCustomerById(id)
          .then((response) => {
            $scope.customer = response;
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
            alert("Error Occured. Please Check Log");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      $scope.closeCustomer = () => {
        $scope.currentView = "customers";
      };

      $scope.adminProfile = {
        name: "Admin User",
        email: "admin@vehiclesystem.com",
        phone: "(555) 123-4567",
      };

      $scope.newVehicle = {};
      $scope.regFilter = "";

      // View management
      $scope.setView = function (view) {
        $scope.currentView = view;
      };

      // Modal functions
      $scope.action = "Add";
      $scope.showAddVehicleModal = function (action) {
        $scope.showModal = true;
        if (action !== "edit") {
          $scope.newVehicle = {};
          $scope.action = "Add";
        } else {
          $scope.action = "Edit";
        }
      };

      $scope.closeModal = function () {
        $scope.showModal = false;
        $scope.newVehicle = {};
        $scope.getAllVehicle();
      };

      // Vehicle functions
      $scope.addVehicle = function () {
        console.log($scope.newVehicle.color);
        $scope.newVehicle.color = $scope.newVehicle.color.trim();
        console.log($scope.newVehicle.color);
        $scope.newVehicle.colors = $scope.newVehicle.color.split(" ");
        delete $scope.newVehicle.color;
        // console.log($scope.newVehicle);
        if ($scope.action === "Add") {
          $rootScope.isLoading = true;
          adminService
            .addVehicle($scope.newVehicle)
            .then((response) => {
              alert("Vehicle Added Successfully");
            })
            .then(() => {
              $scope.getAllVehicle();
            })
            .catch((error) => {
              console.log(error);
              alert("Error Occured. Please Check Log");
            })
            .finally(() => {
              $rootScope.isLoading = false;
            });
        } else {
          // alert($scope.newVehicle.id);
          $rootScope.isLoading = true;
          adminService
            .editVehicle($scope.newVehicle)
            .then((response) => {
              alert("Vehicle Edited Successfully");
            })
            .then(() => {
              $scope.getAllVehicle();
            })
            .catch((error) => {
              console.log(error);
              alert("Error Occured. Please Check Log");
            })
            .finally(() => {
              $rootScope.isLoading = false;
            });
        }
        $scope.closeModal();
      };

      $scope.viewVehicle = function (vehicle, view) {
        $scope.setView(view);
        $scope.newVehicle = vehicle;
      };

      $scope.editVehicle = function (vehicle) {
        $scope.newVehicle = vehicle;
        let colors = "";
        vehicle.colors.map((color) => {
          colors = colors + " " + color;
        });
        delete $scope.newVehicle.colors;
        $scope.newVehicle.color = colors;
        // console.log($scope.newVehicle);
        $scope.showAddVehicleModal("edit");
        // alert("Editing vehicle: " + id);
      };

      $scope.deleteVehicle = function (id) {
        if (confirm("Are you sure you want to delete this vehicle?")) {
          $scope.vehicles = $scope.vehicles.filter((v) => v.id !== id);
        }
      };

      // Registration functions
      $scope.viewRegistrationDetails = function (id, email) {
        // alert("Viewing registration: " + id);
        $scope.currentView = "registrationDetail";
        $rootScope.isLoading = true;
        adminService
          .getRegistrationById(id)
          .then((response) => {
            $scope.registration = response;
            console.log($scope.registration);
          })
          .then(() => {
            adminService
              .getVehicleDetailsById($scope.registration.vehicleId)
              .then((response) => {
                $scope.newVehicle = response;
                console.log($scope.newVehicle);
              });
          })
          .catch(() => {
            console.log(error);
            alert("Error Occured. Please Check Log");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });

        adminService
          .getCustomerByEmail(email)
          .then((response) => {
            $scope.customer = response;
            console.log($scope.customer);
          })
          .catch((error) => {
            console.log(error);
            alert("Error Occured. Please Check Log");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      $scope.goToRegistration = () => {
        $scope.currentView = "registrations";
      };

      $scope.registrationAction = function (id, message) {
        $rootScope.isLoading = true;
        adminService
          .takeAction(id, message)
          .then(() => {
            $scope.getAllRegistrations();
          })
          .catch(() => {
            console.log(error);
            alert("Error Occured. Please Check Log");
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      };

      $scope.setProfile = () => {
        $scope.customer = loginService.getCustomer();
      };
      // Profile functions
      $scope.updateProfile = function () {
        if ($scope.customer.password === undefined) {
          $scope.customer.password = "";
        }
        if ($scope.customer.confirmPassword === undefined) {
          $scope.customer.confirmPassword = "";
        }
        if ($scope.customer.password !== $scope.customer.confirmPassword) {
          alert("Password don't match");
          console.log($scope.customer.password);
          console.log($scope.customer.confirmPassword);
        } else {
          delete $scope.customer.confirmPassword;
          delete $scope.customer.id;
          // $scope.customer.id=Number($scope.customer.id);
          $rootScope.isLoading = true;
          console.log($scope.customer);
          customerService
            .updateCustomer($scope.customer)
            .then((response) => {
              alert("Details Updated Successfully");
              loginService.setCustomer(response, loginService.getRole());
            })
            .catch((error) => {
              console.log(error);
              alert("Error Occured. Please Check Log");
            })
            .finally(() => {
              $rootScope.isLoading = false;
            });
        }
      };

      // Logout
      $scope.logout = function () {
        if (confirm("Are you sure you want to logout?")) {
          loginService.clearCustomer();
          $location.path("/login");
          // alert("Logged out successfully");
        }
      };
    } else {
      $location.path("/login");
    }
  },
]);

app.controller("password", [
  "$scope",
  "$location",
  "registerService",
  "adminService",
  "loginService",
  "$rootScope",
  function (
    $scope,
    $location,
    registerService,
    adminService,
    loginService,
    $rootScope
  ) {
    $scope.showPage1 = true;
    $scope.showPage2 = false;
    $scope.showPage3 = false;
    $scope.email = "";
    $scope.otp = "";
    $scope.newPassword = "";
    $scope.confirmPassword = "";
    let otp;
    // Step 1: Send OTP
    $scope.sendOTP = function () {
      if (!$scope.email) {
        alert("Please enter your email.");
      } else {
        $rootScope.isLoading = true;
        adminService
          .getCustomerByEmail($scope.email)
          .then((response) => {
            console.log("User found");
            console.log(response);
            otp = Math.floor(Math.random() * 10000) + "";
            for (let i = otp.length; i < 4; i++) {
              otp = "0" + otp;
            }

            let emailBody = {
              to: $scope.email,
              subject:
                "Vehicle Registration System Registration Reset Your Password OTP",
              body:
                "OTP is " +
                otp +
                " \nDo not share with any one \nOTP is valid for 5 min only",
            };
            // console.log(emailBody);
            $rootScope.isLoading = true;
            registerService
              .sendOTP(emailBody)
              .then((response) => {
                alert("Email sent Successfully");
              })
              .then(() => {
                $scope.showPage1 = false;
                $scope.showPage2 = true;
              })
              .catch((error) => {
                alert("Error Occured check consol");
                console.log(error);
              })
              .finally(() => {
                $rootScope.isLoading = false;
              });
          })
          .catch((error) => {
            alert("User not Found");
            console.log(error);
            return;
          })
          .finally(() => {
            $rootScope.isLoading = false;
          });
      }
    };

    // Step 2: Verify OTP
    $scope.verifyOTP = function () {
      if (!$scope.otp) {
        alert("Please enter the OTP.");
        return;
      }
      if (otp !== $scope.otp) {
        alert("Please enter valid OTP.");
        return;
      }

      $scope.showPage2 = false;
      $scope.showPage3 = true;
    };

    // Step 3: Reset Password
    $scope.resetPassword = function () {
      if (!$scope.newPassword || !$scope.confirmPassword) {
        alert("Please fill both password fields.");
        return;
      }

      if ($scope.newPassword !== $scope.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      $rootScope.isLoading = true;
      loginService
        .resetPassword({ email: $scope.email, password: $scope.newPassword })
        .then((response) => {
          alert("Password reset successful!");
          $location.path("/login");
        })
        .catch((error) => {
          alert("Error occured. Check Consol");
          console.log(error);
        })
        .finally(() => {
          $rootScope.isLoading = false;
        });
    };
  },
]);

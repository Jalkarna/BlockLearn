(function ($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Touch?
  if (browser.mobile) $body.addClass("is-touch");

  // Forms.
  var $form = $("form");

  // Auto-resizing textareas.
  $form.find("textarea").each(function () {
    var $this = $(this),
      $wrapper = $('<div class="textarea-wrapper"></div>'),
      $submits = $this.find('input[type="submit"]');

    $this
      .wrap($wrapper)
      .attr("rows", 1)
      .css("overflow", "hidden")
      .css("resize", "none")
      .on("keydown", function (event) {
        if (event.keyCode == 13 && event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();

          $(this).blur();
        }
      })
      .on("blur focus", function () {
        $this.val($.trim($this.val()));
      })
      .on("input blur focus --init", function () {
        $wrapper.css("height", $this.height());

        $this
          .css("height", "auto")
          .css("height", $this.prop("scrollHeight") + "px");
      })
      .on("keyup", function (event) {
        if (event.keyCode == 9) $this.select();
      })
      .triggerHandler("--init");

    // Fix.
    if (browser.name == "ie" || browser.mobile)
      $this.css("max-height", "10em").css("overflow-y", "auto");
  });

  // Menu.
  var $menu = $("#menu");

  $menu.wrapInner('<div class="inner"></div>');

  $menu._locked = false;

  $menu._lock = function () {
    if ($menu._locked) return false;

    $menu._locked = true;

    window.setTimeout(function () {
      $menu._locked = false;
    }, 350);

    return true;
  };

  $menu._show = function () {
    if ($menu._lock()) $body.addClass("is-menu-visible");
  };

  $menu._hide = function () {
    if ($menu._lock()) $body.removeClass("is-menu-visible");
  };

  $menu._toggle = function () {
    if ($menu._lock()) $body.toggleClass("is-menu-visible");
  };

  $menu
    .appendTo($body)
    .on("click", function (event) {
      event.stopPropagation();
    })
    .on("click", "a", function (event) {
      var href = $(this).attr("href");

      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $menu._hide();

      // Redirect.
      if (href == "#menu") return;

      window.setTimeout(function () {
        window.location.href = href;
      }, 350);
    })
    .append('<a class="close" href="#menu">Close</a>');

  $body
    .on("click", 'a[href="#menu"]', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Toggle.
      $menu._toggle();
    })
    .on("click", function (event) {
      // Hide.
      $menu._hide();
    })
    .on("keydown", function (event) {
      // Hide on escape.
      if (event.keyCode == 27) $menu._hide();
    });
})(jQuery);

// Ensure the script runs after the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if Phantom Wallet is available
  if (window.solana && window.solana.isPhantom) {
    // Handle page load check for connected wallet
    if (window.solana.isConnected) {
      updateWalletUI(window.solana.publicKey.toString());
    }

    // Add event listener to connect button
    document
      .getElementById("connect-wallet")
      .addEventListener("click", async function () {
        try {
          // Connect to Phantom Wallet
          const response = await window.solana.connect();
          const walletAddress = response.publicKey.toString();

          // Update the UI with the connected wallet
          updateWalletUI(walletAddress);
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      });

    // Logout functionality
    document
      .querySelector("#logout")
      .addEventListener("click", async function () {
        try {
          await window.solana.disconnect(); // Disconnect Phantom wallet

          // Reset UI to show "Connect Wallet"
          resetUI();
          console.log("User logged out");
        } catch (error) {
          console.error("Error during logout:", error);
        }
      });
  } else {
    console.log("Phantom Wallet is not available");
  }
});

// Function to update the UI when wallet is connected
function updateWalletUI(walletAddress) {
  // Truncate and display the wallet address
  const truncatedAddress = `${walletAddress.slice(
    0,
    6
  )}...${walletAddress.slice(-4)}`;

  document.getElementById("connect-wallet").style.display = "none";
  document.getElementById("wallet-dropdown").style.display = "block";
  document
    .getElementById("wallet-address")
    .querySelector(".truncated-address").innerText = truncatedAddress;

  // Placeholder wallet balance (can replace with actual API call)
  const balance = "5 SOL";
  document.getElementById("wallet-balance").innerText = balance;
}

// Function to reset UI when logged out
function resetUI() {
  document.getElementById("wallet-dropdown").style.display = "none";
  document.getElementById("connect-wallet").style.display = "block";
  document
    .getElementById("wallet-address")
    .querySelector(".truncated-address").innerText = ""; // Clear wallet address
}

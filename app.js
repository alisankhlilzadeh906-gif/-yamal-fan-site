/* =====================================================
   Lamine Yamal Fan Website
   app.js
   ===================================================== */

window.app = window.app || {};


// =====================================================
// Toast
// =====================================================

app.toast = function (message, type = "info") {

  let oldToast =
    document.getElementById("appToast");

  if (oldToast) oldToast.remove();


  const toast =
    document.createElement("div");


  toast.id = "appToast";

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "25px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.zIndex = "99999";
  toast.style.padding = "13px 20px";
  toast.style.borderRadius = "12px";
  toast.style.color = "#fff";
  toast.style.fontFamily =
    "Tahoma, Arial, sans-serif";
  toast.style.fontSize = "14px";
  toast.style.boxShadow =
    "0 10px 30px rgba(0,0,0,.2)";


  if (type === "success") {

    toast.style.background = "#16a34a";

  } else if (type === "error") {

    toast.style.background = "#dc2626";

  } else {

    toast.style.background = "#2563eb";

  }


  document.body.appendChild(toast);


  setTimeout(
    () => toast.remove(),
    3000
  );

};



// =====================================================
// Escape HTML
// =====================================================

app.escapeHTML = function (text) {

  if (
    text === null ||
    text === undefined
  ) {
    return "";
  }


  const div =
    document.createElement("div");


  div.textContent =
    String(text);


  return div.innerHTML;

};



// =====================================================
// Get current user
// =====================================================

app.getUser = async function () {

  try {

    if (!window.sb) {

      console.warn(
        "Supabase is not initialized."
      );

      return null;

    }


    const {
      data,
      error
    } = await sb.auth.getUser();


    if (error) {

      console.error(error);

      return null;

    }


    return data.user || null;

  } catch (error) {

    console.error(
      "getUser error:",
      error
    );

    return null;

  }

};



// =====================================================
// Get profile
// =====================================================

app.getProfile = async function (userId) {

  try {

    if (
      !window.sb ||
      !userId
    ) {
      return null;
    }


    const {
      data,
      error
    } = await sb
      .from("profiles")
      .select(
        "id, username, avatar_url, is_admin, created_at"
      )
      .eq("id", userId)
      .maybeSingle();


    if (error) {

      console.error(
        "Profile error:",
        error
      );

      return null;

    }


    return data;

  } catch (error) {

    console.error(
      "getProfile error:",
      error
    );

    return null;

  }

};



// =====================================================
// Require login
// =====================================================

app.requireAuth = async function () {

  const user =
    await app.getUser();


  if (!user) {

    const currentPage =
      window.location.pathname
        .split("/")
        .pop();


    const redirect =
      encodeURIComponent(
        currentPage || "index.html"
      );


    window.location.href =
      "login.html?redirect=" +
      redirect;


    return null;

  }


  return user;

};



// =====================================================
// Logout
// =====================================================

app.logout = async function () {

  try {

    if (!window.sb) {

      window.location.href =
        "login.html";

      return;

    }


    const {
      error
    } = await sb.auth.signOut();


    if (error) {

      console.error(error);

      app.toast(
        "خطا هنگام خروج از حساب",
        "error"
      );

      return;

    }


    localStorage.removeItem(
      "yamalSession"
    );


    app.toast(
      "با موفقیت از حساب خارج شدی",
      "success"
    );


    setTimeout(
      () => {

        window.location.href =
          "index.html";

      },
      700
    );


  } catch (error) {

    console.error(error);

    window.location.href =
      "index.html";

  }

};



// =====================================================
// Dark mode
// =====================================================

app.loadDarkMode = function () {

  const dark =
    localStorage.getItem(
      "yamalDarkMode"
    ) === "true";


  if (dark) {

    document.body.classList.add(
      "dark"
    );

  }


  app.updateDarkButton();

};



app.toggleDarkMode = function () {

  document.body.classList.toggle(
    "dark"
  );


  const dark =
    document.body.classList.contains(
      "dark"
    );


  localStorage.setItem(
    "yamalDarkMode",
    dark ? "true" : "false"
  );


  app.updateDarkButton();

};



app.updateDarkButton = function () {

  const buttons =
    document.querySelectorAll(
      "[data-dark-mode], #darkButton"
    );


  buttons.forEach(button => {

    button.textContent =
      document.body.classList.contains(
        "dark"
      )
        ? "☀️"
        : "🌙";

  });

};



// =====================================================
// Mobile menu
// =====================================================

app.toggleMenu = function () {

  const menu =
    document.getElementById(
      "navLinks"
    );


  if (!menu) return;


  menu.classList.toggle(
    "open"
  );

};



document.addEventListener(
  "click",
  function (event) {

    const menu =
      document.getElementById(
        "navLinks"
      );


    const button =
      document.querySelector(
        ".mobile-menu"
      );


    if (
      !menu ||
      !button
    ) {
      return;
    }


    if (
      menu.classList.contains(
        "open"
      ) &&
      !menu.contains(
        event.target
      ) &&
      !button.contains(
        event.target
      )
    ) {

      menu.classList.remove(
        "open"
      );

    }

  }
);



// =====================================================
// Refresh navigation
// =====================================================

app.refreshNav = async function () {

  const user =
    await app.getUser();


  const loginLinks =
    document.querySelectorAll(
      "[data-login-link], .login-link"
    );


  const accountLinks =
    document.querySelectorAll(
      "[data-account-link]"
    );


  const logoutButtons =
    document.querySelectorAll(
      "[data-logout]"
    );


  if (user) {

    loginLinks.forEach(link => {

      link.textContent =
        "👤 حساب کاربری";


      link.href =
        "dashboard.html";

    });


    accountLinks.forEach(link => {

      link.style.display = "";

      link.href =
        "dashboard.html";

    });


    logoutButtons.forEach(button => {

      button.style.display = "";

    });

  } else {

    loginLinks.forEach(link => {

      link.textContent =
        "👤 ورود / ثبت‌نام";


      link.href =
        "login.html";

    });


    accountLinks.forEach(link => {

      link.style.display = "none";

    });


    logoutButtons.forEach(button => {

      button.style.display =
        "none";

    });

  }

};



// =====================================================
// Save local session
// =====================================================

app.saveLocalSession = async function () {

  const user =
    await app.getUser();


  if (!user) {

    localStorage.removeItem(
      "yamalSession"
    );

    return;

  }


  const profile =
    await app.getProfile(
      user.id
    );


  localStorage.setItem(
    "yamalSession",
    JSON.stringify({

      id: user.id,

      email:
        user.email || "",

      username:
        profile?.username || "",

      avatar_url:
        profile?.avatar_url || ""

    })
  );

};



// =====================================================
// Notification counter
// =====================================================

app.updateNotificationCount =
  async function () {

    try {

      const user =
        await app.getUser();


      if (!user || !window.sb) {

        app.removeNotificationBadge();

        return;

      }


      const {
        count,
        error
      } = await sb
        .from("notifications")
        .select(
          "id",
          {
            count: "exact",
            head: true
          }
        )
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "is_read",
          false
        );


      if (error) {

        console.error(
          "Notification count error:",
          error
        );

        return;

      }


      app.showNotificationBadge(
        count || 0
      );


    } catch (error) {

      console.error(
        "Notification count error:",
        error
      );

    }

  };



// =====================================================
// Show notification badge
// =====================================================

app.showNotificationBadge =
  function (count) {

    const links =
      document.querySelectorAll(
        'a[href="notifications.html"]'
      );


    links.forEach(link => {

      let badge =
        link.querySelector(
          ".notification-badge"
        );


      if (!count || count <= 0) {

        if (badge) {

          badge.remove();

        }

        return;

      }


      if (!badge) {

        badge =
          document.createElement(
            "span"
          );


        badge.className =
          "notification-badge";


        badge.style.cssText = `
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-width:20px;
          height:20px;
          padding:0 5px;
          margin-right:5px;
          border-radius:20px;
          background:#dc2626;
          color:white;
          font-size:11px;
          font-weight:bold;
          vertical-align:middle;
        `;


        link.appendChild(
          badge
        );

      }


      badge.textContent =
        count > 99
          ? "99+"
          : String(count);

    });

  };



// =====================================================
// Remove notification badge
// =====================================================

app.removeNotificationBadge =
  function () {

    const badges =
      document.querySelectorAll(
        ".notification-badge"
      );


    badges.forEach(
      badge => badge.remove()
    );

  };



// =====================================================
// Listen for authentication changes
// =====================================================

app.listenAuth = function () {

  if (!window.sb) return;


  sb.auth.onAuthStateChange(
    async function (
      event,
      session
    ) {

      if (session?.user) {

        await app.saveLocalSession();

      } else {

        localStorage.removeItem(
          "yamalSession"
        );

        app.removeNotificationBadge();

      }


      await app.refreshNav();

      await app.updateNotificationCount();

    }
  );

};



// =====================================================
// Listen for new notifications
// =====================================================

app.listenNotifications =
  function () {

    if (!window.sb) return;


    sb.auth.getUser()
      .then(result => {

        const user =
          result?.data?.user;


        if (!user) return;


        sb
          .channel(
            "app-notifications-" +
            user.id
          )
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter:
                "user_id=eq." +
                user.id
            },
            payload => {

              app.updateNotificationCount();


              app.toast(
                "🔔 اعلان جدید داری!",
                "success"
              );

            }
          )
          .subscribe();

      });

  };



// =====================================================
// Initialize
// =====================================================

app.init = async function () {

  app.loadDarkMode();


  await app.refreshNav();


  await app.saveLocalSession();


  await app.updateNotificationCount();


  app.listenAuth();


  app.listenNotifications();

};



// =====================================================
// Global functions
// =====================================================

window.toggleDarkMode =
  app.toggleDarkMode;


window.toggleMenu =
  app.toggleMenu;


window.logout =
  app.logout;



// =====================================================
// Start
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    app.init();

  }
);
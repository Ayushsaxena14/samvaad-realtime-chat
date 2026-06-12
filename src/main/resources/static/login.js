window.onload = function ()
{
    clearForms();
};

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");

const loginBtn =
    document.getElementById("loginBtn");

const signupBtn =
    document.getElementById("signupBtn");

const message =
    document.getElementById("message");

function clearForms()
{
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";

    document.getElementById("signupUsername").value = "";
    document.getElementById("signupPassword").value = "";
}

showSignup.addEventListener("click", (e) =>
{
    e.preventDefault();

    loginForm.style.display = "none";

    signupForm.style.display = "block";

    signupForm.classList.remove("form-container");

    void signupForm.offsetWidth;

    signupForm.classList.add("form-container");

    message.innerText = "";

    clearForms();
});

showLogin.addEventListener("click", (e) =>
{
    e.preventDefault();

    signupForm.style.display = "none";

    loginForm.style.display = "block";

    loginForm.classList.remove("form-container");

    void loginForm.offsetWidth;

    loginForm.classList.add("form-container");

    message.innerText = "";

    clearForms();
});

loginBtn.addEventListener("click", async () =>
{
    const username =
        document.getElementById("loginUsername").value;

    const password =
        document.getElementById("loginPassword").value;

    if(username.trim() === "" ||
       password.trim() === "")
    {
        message.innerText =
            "Fields cannot be empty";

        return;
    }

    const response = await fetch(
        "/api/login",
        {
            method:"POST",

            headers:
            {
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                username,
                password
            })
        }
    );

    const data =
        await response.json()
            .catch(() => null);

    if(response.ok)
    {
        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "username",
            data.username
        );

        window.location.href =
            "chat.html";
    }
    else
    {
        message.style.color =
            "#ef4444";

        message.innerText =
            data || "Invalid credentials";
    }
});

signupBtn.addEventListener("click", async () =>
{
    const username =
        document.getElementById("signupUsername").value;

    const password =
        document.getElementById("signupPassword").value;

    if(username.trim() === "" ||
       password.trim() === "")
    {
        message.innerText =
            "Fields cannot be empty";

        return;
    }

    const response = await fetch(
        "/api/signup",
        {
            method:"POST",

            headers:
            {
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                username,
                password
            })
        }
    );

    const data =
        await response.json()
            .catch(() => null);

    if(response.ok)
    {
        message.style.color =
            "#22c55e";

        message.innerText =
            "Signup successful. Please login.";

        signupForm.style.display =
            "none";

        loginForm.style.display =
            "block";

        clearForms();
    }
    else
    {
        message.style.color =
            "#ef4444";

        message.innerText =
            data || "Signup failed";
    }
});
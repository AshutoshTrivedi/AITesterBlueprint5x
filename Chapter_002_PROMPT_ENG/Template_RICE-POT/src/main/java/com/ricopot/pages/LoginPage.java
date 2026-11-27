package com.ricopot.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.qameta.allure.Step;

public class LoginPage {
    private static final String LOGIN_URL = "https://login.salesforce.com/?locale=in";
    private static final By LOGIN_ERROR = By.xpath("//div[@id='error']");

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        PageFactory.initElements(driver, this);
    }

    @Step("Open the Salesforce login page")
    public void open() {
        try {
            driver.get(LOGIN_URL);
            wait.until(ExpectedConditions.visibilityOf(usernameInput));
        } catch (WebDriverException exception) {
            throw new IllegalStateException("Unable to open the Salesforce login page.", exception);
        }
    }

    @Step("Submit login credentials")
    public void login(String username, String password) {
        try {
            wait.until(ExpectedConditions.visibilityOf(usernameInput)).clear();
            usernameInput.sendKeys(username);
            passwordInput.clear();
            passwordInput.sendKeys(password);
            wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
        } catch (WebDriverException exception) {
            throw new IllegalStateException("Unable to submit the Salesforce login form.", exception);
        }
    }

    @Step("Wait for a redirect away from the Salesforce login page")
    public boolean hasRedirectedFromLoginPage() {
        try {
            return new WebDriverWait(driver, Duration.ofSeconds(30))
                    .until(currentDriver -> !currentDriver.getCurrentUrl().contains("login.salesforce.com"));
        } catch (TimeoutException exception) {
            return false;
        } catch (WebDriverException exception) {
            throw new IllegalStateException("Unable to verify the post-login page.", exception);
        }
    }

    @Step("Read the Salesforce login error")
    public String getLoginError() {
        try {
            WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(LOGIN_ERROR));
            return error.getText().trim();
        } catch (WebDriverException exception) {
            throw new IllegalStateException("The Salesforce login error was not displayed.", exception);
        }
    }

    @Step("Set the Remember Me option to {rememberMe}")
    public void setRememberMe(boolean rememberMe) {
        try {
            WebElement checkbox = wait.until(ExpectedConditions.visibilityOf(rememberMeCheckbox));
            if (checkbox.isSelected() != rememberMe) {
                checkbox.click();
            }
        } catch (WebDriverException exception) {
            throw new IllegalStateException("Unable to set the Remember Me option.", exception);
        }
    }
}

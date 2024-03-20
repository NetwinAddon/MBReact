package com.netwin.banking

import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.WindowManager
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //  if (!isAppInstalled("com.koushikdutta.vysor")) {
        //     println("If Condition Not install")
        //     disableScreenshots()
        // } else {
        //     allowScreenshots()
        // }
           disableScreenshots()
         
    }

    private fun isAppInstalled(packageName: String): Boolean {
        val pm = packageManager
        return try {
            pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES)
            true
        } catch (e: PackageManager.NameNotFoundException) {
            false
        }
    }

    private fun allowScreenshots() {
        // Allow screenshots logic
        window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
        println("Clear Flags")
    }

    private fun disableScreenshots() {
        // Disable screenshots logic
        window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        println("Set Flags")
    }

    override fun getMainComponentName(): String {
        return "MobileBanking"
    }
}
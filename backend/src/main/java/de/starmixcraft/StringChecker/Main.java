package de.starmixcraft.StringChecker;

import java.io.File;

import de.starmixcraft.StringChecker.ckecker.StringChecker;
import de.starmixcraft.StringChecker.cmd.CommandManager;
import de.starmixcraft.StringChecker.restListener.StringCheckRestListener;
import de.starmixcraft.logger.Logger;
import de.starmixcraft.restserver.RestServer;

public class Main {
	public static StringChecker checker;
	static boolean run;
	public static CommandManager manager;
	static RestServer restServer;
	public static void main(String[] args) {
		new Logger(new File("logs"), true, true, false);
		manager = new CommandManager();
		manager.start();
		try {
			checker = StringChecker.load(new File("checker.json"), new File("log.log"));
		} catch (Throwable e) {
			e.printStackTrace();
			System.err.println("Faild to load checker");
			System.exit(0);
		}
		run = true;
		//TODO: add keymanager
		
		restServer = new RestServer(1762, null);
		restServer.setCertPath("/etc/letsencrypt/live/nethergames.de-0001");
		restServer.addListener("", new StringCheckRestListener());
		restServer.start();
		Runtime.getRuntime().addShutdownHook(new Thread(()->{
			if(run) {
				performShutdownTasks();
			}
		}));
		while (run) {
			try {
				Thread.sleep(50);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		performShutdownTasks();
	
	
	}

	private static void performShutdownTasks() {
		System.out.println("Starting shutdown...");
		manager.shutdown();
		restServer.shutdown();
		checker.save(new File("checker.json"));
		System.out.println("Shutdown compleat");
	}
	
	public static void shutdown() {
		run = false;
		
	
	}
}

package de.starmixcraft.StringChecker.cmd;

import java.util.HashMap;
import java.util.Scanner;

import de.starmixcraft.StringChecker.Main;

public class CommandManager extends Thread {

	
	private HashMap<String, CommandExecutor> commands;
	private static Thread commandThread;
	public CommandManager() {
		commands = new HashMap<>();
		commands.put("stop", new CommandExecutor() {
			
			@Override
			public void Execute() {
				Main.shutdown();
				System.out.println("Shutting down");
			}
		});
		setDaemon(true);
		setName("CommandThread");
		commandThread = this;
	}

	private boolean shutdown;
	private static Scanner s;
	@Override
	public void run() {
		s = new Scanner(System.in);
		while (!shutdown && s.hasNextLine()) {
			String line = s.nextLine();
			CommandExecutor c = commands.get(line);
			if(c != null) {
				c.Execute();
			}
		}
	}
	
	public void shutdown() {
		shutdown = true;
		commandThread.interrupt();
		
	}

}

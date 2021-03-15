package de.starmixcraft.StringChecker.logging;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import de.starmixcraft.StringChecker.ckecker.CheckResponds;
import de.starmixcraft.logger.Logger;

public class MessageLogger {

	private transient File f;
	private transient FileWriter fileWriter; // fuck it

	public MessageLogger(File file) {
		f = file;
		openStream(); // Try to open stream now
	}

	private void openStream() {
		if (fileWriter != null) {
			try {
				fileWriter.flush();
				fileWriter.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		if (f != null) {
			if (!f.exists()) {
				try {
					f.createNewFile();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			try {
				fileWriter = new FileWriter(f, true);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void flush() {
		try {
			fileWriter.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void writeToLog(String tocheck, CheckResponds responds) {
		if(fileWriter == null) {
			openStream(); //try to open stream
		}
		if (fileWriter != null) {
			try {
				fileWriter.write("[" + Logger.now() + "] ("+responds.getCheckID()+") " + tocheck + " : "
						+ responds.toString());
				fileWriter.write(System.lineSeparator());
				fileWriter.flush();
			} catch (IOException e) {
				e.printStackTrace();
				openStream(); // try to reopen the stream
			}
		} else {
			openStream(); // filewriter null, open the stream
		}
	}
}

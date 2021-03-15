package de.starmixcraft.StringChecker.ckecker;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import de.starmixcraft.StringChecker.logging.MessageLogger;

public class StringChecker {

	public ArrayList<String> beleidigungen;
	public ArrayList<String> werbung;
	public ArrayList<String> replacements;
	public HashMap<String, ArrayList<String>> allowedads;
	public HashMap<String, ArrayList<String>> allowedswares;
	public volatile long nextID;
	

	private static final Gson GSON = new GsonBuilder().setPrettyPrinting().serializeNulls().disableHtmlEscaping()
			.create();
	
	private MessageLogger logger;
	public StringChecker(File f) {
		beleidigungen = new ArrayList<>();
		werbung = new ArrayList<>();
		replacements = new ArrayList<>();
		allowedads = new HashMap<>();
		allowedswares = new HashMap<>();
		nextID = 0;
		logger = new MessageLogger(f);
	}
	
	public CheckResponds check(String rawInput, boolean checkSwars, boolean checkAds, boolean checkSpam) {
		if(rawInput.isEmpty()) {
			return CheckResponds.empty();
		}
		
		String strippedOfJunk = stripOfJunk(rawInput);
		String strippedOfPoins = strippedOfJunk.replace(".", "");
		ArrayList<CheckMatch> detectedSwares = checkSwars ? checkString(strippedOfPoins, beleidigungen, allowedswares) : new ArrayList<CheckMatch>();
		ArrayList<CheckMatch> detectedAdds = checkAds ? checkString(strippedOfJunk, werbung, allowedads) : new ArrayList<CheckMatch>();
		
		CheckResponds responds = new CheckResponds(rawInput, detectedSwares, detectedAdds, checkSpam ? checkForSpam(rawInput) : false, nextID++);
		logger.writeToLog(rawInput, responds);
		return responds;
	}
	
	private ArrayList<CheckMatch> checkString(String in, ArrayList<String> banned, HashMap<String, ArrayList<String>> allowed) {
		ArrayList<CheckMatch> out = new ArrayList<>();
		for (String sware : banned) {
			int index = in.indexOf(sware);
			while (index >= 0) {
				ArrayList<String> allowedswares = allowed.get(sware);
				boolean isContext = false;
				if (allowedswares != null) {
					for (String allowrd : allowedswares) {
						if (isInContext(in, index, sware, allowrd)) {
							isContext = true;
							break;
						}
					}
				}
				if (!isContext) {
					CheckMatch checkMatch = new CheckMatch(sware, -1, -1);
					char first = checkMatch.getStartIndexChar();
					char last = checkMatch.getEndIndexChar();
					int firstCount = countCharsUntillIndex(first, index, in);
					int lastCount = countCharsUntillIndex(last, index+sware.length()-1, in);
					checkMatch.setStartIndex(firstCount);
					checkMatch.setEndIndex(lastCount);
					out.add(checkMatch);
				}
				index = in.indexOf(sware, index + 1);
			}
		}
	
		return out;
	}
	
	private int countCharsUntillIndex(char c, int index, String in) {
		int count = 0;
		for (int i = 0; i < index; i++) {
			if(in.charAt(i) == c) {
				count++;
			}
		}
		return count;
	}
	
	
	private static boolean canBeContext(String in, int index_in_input, String sware, String allowedcontext) {
		int index_in_context = allowedcontext.indexOf(sware);
		if (index_in_context == -1 || index_in_input == -1) {
			return false;
		}
		return index_in_context <= index_in_input
				&& (in.length() - index_in_input >= allowedcontext.length() - index_in_context);
	}

	private static boolean isInContext(String in, int index_in_input, String sware, String allowedcontext) {
		if (!canBeContext(in, index_in_input, sware, allowedcontext))
			return false;
		int index_in_context = allowedcontext.indexOf(sware);
		return in.regionMatches(index_in_input - index_in_context, allowedcontext, 0, allowedcontext.length());
	}
	
	private String stripOfJunk(String in) {
		in = in.toLowerCase(Locale.ROOT);
		for (String string : replacements) {
			in = in.replace(string, "");
		}
		return in.replace(" ", "");
	}
	
	private boolean checkForSpam(String in) {
		int pointer = 0;
		int maxallowedinsequens = 5;
		while (pointer < in.length()) {
			int count = 0;
			for (int i = pointer + 1; i < in.length(); i++) {
				if (in.charAt(pointer) == in.charAt(i)) {
					count++;
				} else {
					break;
				}
				if (count >= maxallowedinsequens) {
					return true;
				}
			}
			pointer++;
		}
		return false;
	}
	

	
	public void save(File file) {
		try {
			logger.flush();
			FileWriter w = new FileWriter(file);
			w.write(GSON.toJson(this));
			w.flush();
			w.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static StringChecker load(File file, File logfile) throws Throwable {
		FileReader json = new FileReader(file);
		StringChecker newc = new StringChecker(logfile);
		StringChecker checker = GSON.fromJson(json, StringChecker.class);
		checker.logger = newc.logger;
		json.close();
		return checker;
	}
}

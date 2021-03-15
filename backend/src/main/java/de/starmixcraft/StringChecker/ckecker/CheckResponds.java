package de.starmixcraft.StringChecker.ckecker;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
@AllArgsConstructor
@Getter
@ToString
public class CheckResponds {
	private String rawMessage;
	private ArrayList<CheckMatch> swars;
	private ArrayList<CheckMatch> adds;
	private boolean containsSpam;
	private long checkID;

	
	
	public boolean isEmpty() {
		return swars.isEmpty() && adds.isEmpty() && !containsSpam;
	}
	private static final ArrayList<CheckMatch> EMPTY = new ArrayList<CheckMatch>();
	private static final CheckResponds EMPTY_RES = new CheckResponds(null, EMPTY, EMPTY, false, -1);
	public static CheckResponds empty() {
		return EMPTY_RES;
	}
	
	public String highlightToHTML() {
		String highlight = new String(rawMessage);
		for(CheckMatch m : swars) {
			highlight = m.highlightData(highlight, "<b>", "</b>");
		}
		for(CheckMatch m : adds) {
			highlight = m.highlightData(highlight, "<i>", "</i>");
		}
		return highlight;
	}
}

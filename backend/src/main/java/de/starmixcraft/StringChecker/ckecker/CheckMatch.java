package de.starmixcraft.StringChecker.ckecker;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class CheckMatch {
	private String found;
	private int startIndex, endIndex;
	
	
	
	
	public char getStartIndexChar() {
		return Character.toLowerCase(found.charAt(0));
	}
	
	public char getEndIndexChar() {
		return Character.toLowerCase(found.charAt(found.length()-1));
	}
	
	public String highlightData(String rawInput, String prefix, String suffix) {
		int wordStartIndex = getIndexOfSecherdChar(startIndex, getStartIndexChar(), rawInput);
		int wordEndIndex = getIndexOfSecherdChar(endIndex, getEndIndexChar(), rawInput)+1;
		return rawInput.substring(0, wordStartIndex) + prefix + rawInput.substring(wordStartIndex, wordEndIndex) + suffix + rawInput.substring(wordEndIndex, rawInput.length());
	}
	
	private int getIndexOfSecherdChar(int toSkip, char target, String input) {	
		for (int i = 0; i < input.length(); i++) {
			if(Character.toLowerCase(input.charAt(i)) == target) {
				if(toSkip > 0) {
					toSkip--;
				}else {
					return i;
				}
			}
		}
		return -1;
	}
	
}

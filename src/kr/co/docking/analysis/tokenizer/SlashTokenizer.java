package kr.co.docking.analysis.tokenizer;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;

public class SlashTokenizer extends CharacterTokenizer {

	public SlashTokenizer(String in){
		this(new StringReader(in));
	}

	public SlashTokenizer(Reader in) {
		super(in,new char[]{'/'});
	}

	public void analyze() throws InstantiationException, IllegalAccessException, IOException {
		super.analyze();
	}
}

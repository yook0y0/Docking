package analysis.tokenizer;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;

public class WhiteSpaceTokenizer extends CharacterTokenizer {

	public WhiteSpaceTokenizer(String in){
		this(new StringReader(in));
	}

	public WhiteSpaceTokenizer(Reader in) {
		super(in,new char[]{' '});
	}

	public void analyze() throws InstantiationException, IllegalAccessException, IOException {
		super.analyze();
	}
}

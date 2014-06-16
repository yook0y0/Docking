package analysis.tokenizer;

import java.io.Reader;

import analysis.attribute.AttributeSource;

public abstract class Tokenizer extends AttributeSource {

	private Reader in;

	public Tokenizer(Reader in) {
		super();
		this.in = in;
	}

	public Reader getIn() {
		return in;
	}

	public void setIn(Reader in) {
		this.in = in;
	}
}

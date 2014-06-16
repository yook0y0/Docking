package analysis.attribute;

public class DataAttribute extends BaseAttribute {

	private byte[][] type;
	private byte[][] data;
	
	public DataAttribute() {
		this(Attr.PROCESS_NO_PROCESS,null,null);
	}
	
	public DataAttribute(int process) {
		this(process,null,null);
	}
	
	public DataAttribute(byte[][] type, byte[][] data) {
		this(Attr.PROCESS_NO_PROCESS,type,data);
	}

	public DataAttribute(int process, byte[][] type, byte[][] data) {
		super(process);
		this.type = type;
		this.data = data;
	}

	public byte[][] getType() {
		return type;
	}

	public void setType(byte[][] type) {
		this.type = type;
	}

	public byte[][] getData() {
		return data;
	}

	public void setData(byte[][] data) {
		this.data = data;
	}

	public boolean clear() {
		// TODO Auto-generated method stub
		super.setProcess(Attr.PROCESS_NO_PROCESS);
		this.type = null;
		this.data = null;
		if(this.type != null || this.data != null)
			return false;
		return true;
	}
}
package analyze.filter;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import analyze.DockingStream;
import analyze.attribute.AttributeDataType;

public class FileToBytesFilter extends DockingFilter {

	public FileToBytesFilter(DockingStream stream) {
		super(stream);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		/*	this.getAttrSet().put(AttributeDataType.FILE_BYTE_DATA,this.getBytesFromFile(new File(this.getStream().getAttrSet().get(AttributeDataType.FILE_RESOURCE_PATH))));
		 */
		this.getAttrSet().put(AttributeDataType.FILE_BYTE_DATA, this.getBytesFromFile(new File(this.getStream().getAttrSet().get(AttributeDataType.FILE_RESOURCE_PATH))));
	}

	@SuppressWarnings("resource")
	private String getBytesFromFile(File file) throws IOException {

		InputStream is = new FileInputStream(file);

		long length = file.length();

		if(length > Integer.MAX_VALUE) {
			// file 크기가 너무 클 경우.. length는 long타입이나 int로 캐스팅하여 씀
			// length 크기가 Integer의 최대값보다 클 경우를 위한 if 문
			// 내부구현 필요함
		}

		// file 데이터를 담을 bytes 변수, 파일 크기에 따라 크기가 잡히게 함. 길이는 int형이여야함
		byte[] bytes = new byte[(int) length];

		int offset = 0;
		int numRead = 0;

		// numRead의 값을 is.Read 함수가 호출될때 넣어줌.
		// FileInputStream의 형태로 읽혀진 file 내용을 byte형태로 bytes 에 넣어주는 역할을 함
		while(offset < bytes.length && (numRead = is.read(bytes, offset, bytes.length - offset)) >= 0) { 
			offset += numRead;
		}

		if(offset < bytes.length) {
			throw new IOException("IOException : " + file.getName());
		}

		is.close();
		
		String[] byteDat = new String[bytes.length];
		for(int i=0;i<bytes.length;i++)
		{
			byteDat[i] = String.valueOf(bytes[i]);
		}
		
		return this.jParseArr(byteDat);
	}
}
package analyze.filter;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import analyze.DockingAnalyzer;
import analyze.attribute.AttributeDataType;

public class FileToBytesFilter extends DockingFilter {

	public FileToBytesFilter(DockingAnalyzer da) {
		super(da);
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
			// file �ш린媛��덈Т ��寃쎌슦.. length��long��엯�대굹 int濡�罹먯뒪�낇븯����
			// length �ш린媛�Integer��理쒕�媛믩낫����寃쎌슦瑜��꾪븳 if 臾�
			// �대�援ы쁽 �꾩슂��
		}

		// file �곗씠�곕� �댁쓣 bytes 蹂�닔, �뚯씪 �ш린���곕씪 �ш린媛��≫엳寃��� 湲몄씠��int�뺤씠�ъ빞��
		byte[] bytes = new byte[(int) length];

		int offset = 0;
		int numRead = 0;

		// numRead��媛믪쓣 is.Read �⑥닔媛��몄텧�좊븣 �ｌ뼱以�
		// FileInputStream���뺥깭濡��쏀�吏�file �댁슜��byte�뺥깭濡�bytes ���ｌ뼱二쇰뒗 ��븷����
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
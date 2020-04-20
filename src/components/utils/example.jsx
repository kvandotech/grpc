const example = `type Field struct {
\tID string
\tName string
\tNumber int32
\tIsMandatory bool
\tEventFieldItem []*EventFieldItem
}

type Message_Humour int32

const (
    Message_UNKNOWN     Message_Humour = 0
    Message_PUNS        Message_Humour = 1
    Message_SLAPSTICK   Message_Humour = 2
    Message_BILL_BAILEY Message_Humour = 3
    Message_HER         Message_Humour = 4
)

var Message_Humour_name = map[int32]string{
    0: "UNKNOWN",
    1: "PUNS",
    2: "SLAPSTICK",
    3: "BILL_BAILEY",
    4: "HER",
}

type Message struct {
\tName                 string                             
\tHilarity             Message_Humour                     
\tHeightInCm           uint32                             
\tData                 []byte                             
\tResultCount          int64  
\tManyThings           []*any.Any
}

type ListOpenFilesRequestProto  int32{
\tID string
\tName string
\tNumber int32
}

type ListOpenFilesResponseProto  int32{
}

type GetEditsFromTxidResponseProto int32{
}`;

export default example;